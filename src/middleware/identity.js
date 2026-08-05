import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/env.js';
import prisma from '../db/prismaClient.js';
import { createSignedToken, verifySignedToken } from '../utils/sessionToken.js';
import { verifyToken } from '../utils/jwtUtils.js';

// In-memory identity verification cache (5-minute TTL) to eliminate cloud DB latency on repeat requests
const verifiedIdentitiesCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const UPDATE_THRESHOLD_MS = 10 * 60 * 1000; // Update last_seen_at in DB at most once every 10 mins

// Periodically prune expired entries to prevent unbounded Map growth (memory leak fix)
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of verifiedIdentitiesCache) {
    if (now - entry.verifiedAt > CACHE_TTL_MS) {
      verifiedIdentitiesCache.delete(id);
    }
  }
}, CACHE_TTL_MS);

cleanupTimer.unref();


export const identityMiddleware = async (req, res, next) => {
  try {
    // Determine client IP safely
    let clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    if (config.trustProxy && req.headers['x-forwarded-for']) {
      clientIp = req.headers['x-forwarded-for'].split(',')[0].trim();
    }

    // Compute salted SHA-256 hash of IP
    console.log(" ipHash : ", config.ipHashSalt)
    const ipHash = crypto
      .createHash('sha256')
      .update(clientIp + config.ipHashSalt)
      .digest('hex');

    req.ipHash = ipHash;

    // Check Authorization header (Bearer token), X-Playground-Identity header, or pg_identity cookie
    let authHeaderToken = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const jwtStr = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(jwtStr);
      if (decoded && decoded.identityId) {
        authHeaderToken = decoded.identityId;
        req.userJwt = decoded; // Store decoded token payload on request
      }
    }

    const rawToken = authHeaderToken || req.headers['x-playground-identity'] || (req.cookies ? req.cookies.pg_identity : null);
    let identityId = null;
    let validIdentity = false;
    const now = Date.now();

    if (rawToken) {
      // Step 1: Anti-Tamper Check — Verify token HMAC signature
      let parsedUuid = verifySignedToken(rawToken);
      if (!parsedUuid && typeof rawToken === 'string' && !rawToken.includes('.')) {
        // Plain UUID fallback for testing or initial migration
        parsedUuid = rawToken;
      }

      if (parsedUuid) {
        const cached = verifiedIdentitiesCache.get(parsedUuid);
        if (cached && (now - cached.verifiedAt < CACHE_TTL_MS)) {
          validIdentity = true;
          identityId = parsedUuid;
          // Non-blocking background update if last_seen_at is older than 10 mins
          if (now - cached.lastUpdated > UPDATE_THRESHOLD_MS) {
            cached.lastUpdated = now;
            prisma.identities.update({
              where: { id: parsedUuid },
              data: { last_seen_at: new Date(), ip_hash: ipHash }
            }).catch((err) => {
              console.warn('[Identity] Background last_seen_at update failed:', err.message);
            });
          }
        } else {
          try {
            const existing = await prisma.identities.findUnique({
              where: { id: parsedUuid }
            });
            if (existing) {
              validIdentity = true;
              identityId = parsedUuid;
              verifiedIdentitiesCache.set(parsedUuid, { verifiedAt: now, lastUpdated: now });
              // Non-blocking background update
              prisma.identities.update({
                where: { id: parsedUuid },
                data: { last_seen_at: new Date(), ip_hash: ipHash }
              }).catch((err) => {
                console.warn('[Identity] Background last_seen_at update failed:', err.message);
              });
            }
          } catch (err) {
            console.warn('[Identity] DB error during identity lookup:', err.message);
          }
        }
      } else {
        console.warn('[Identity] Rejected tampered or invalid session token signature.');
      }
    }

    // Step 2: IP Auto-Recovery Fallback if no valid token was provided
    if (!validIdentity) {
      try {
        const existingIpIdentity = await prisma.identities.findFirst({
          where: { ip_hash: ipHash },
          orderBy: { last_seen_at: 'desc' }
        });

        if (existingIpIdentity) {
          identityId = existingIpIdentity.id;
          validIdentity = true;
          verifiedIdentitiesCache.set(identityId, { verifiedAt: now, lastUpdated: now });
          prisma.identities.update({
            where: { id: identityId },
            data: { last_seen_at: new Date() }
          }).catch((err) => {
            console.warn('[Identity] Background IP last_seen_at update failed:', err.message);
          });
        }
      } catch (err) {
        console.warn('[Identity] DB error during IP identity lookup:', err.message);
      }
    }

    // Step 3: Create new identity if still not found
    if (!validIdentity || !identityId) {
      identityId = uuidv4();
      verifiedIdentitiesCache.set(identityId, { verifiedAt: now, lastUpdated: now });

      // Non-blocking background database creation so page loads respond instantly
      prisma.identities.create({
        data: {
          id: identityId,
          ip_hash: ipHash,
          created_at: new Date(),
          last_seen_at: new Date()
        }
      }).catch((err) => {
        console.warn('[Identity] Background DB identity creation warning:', err.message);
      });
    }

    // Step 4: Emit signed session token to client cookie & response headers
    const signedToken = createSignedToken(identityId);

    res.cookie('pg_identity', signedToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction, // Only send over HTTPS in production
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.setHeader('X-Playground-Identity', signedToken);

    req.identityId = identityId;
    req.signedToken = signedToken;
    next();
  } catch (error) {
    next(error);
  }
};
