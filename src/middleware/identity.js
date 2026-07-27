import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/env.js';
import prisma from '../db/prismaClient.js';

// In-memory identity verification cache (5-minute TTL) to eliminate cloud DB latency on repeat requests
const verifiedIdentitiesCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const UPDATE_THRESHOLD_MS = 10 * 60 * 1000; // Update last_seen_at in DB at most once every 10 mins

// Periodically prune expired entries to prevent unbounded Map growth (memory leak fix)
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of verifiedIdentitiesCache) {
    if (now - entry.verifiedAt > CACHE_TTL_MS) {
      verifiedIdentitiesCache.delete(id);
    }
  }
}, CACHE_TTL_MS);

export const identityMiddleware = async (req, res, next) => {
  try {
    // Determine client IP safely
    let clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    if (config.trustProxy && req.headers['x-forwarded-for']) {
      clientIp = req.headers['x-forwarded-for'].split(',')[0].trim();
    }

    // Compute salted SHA-256 hash of IP
    const ipHash = crypto
      .createHash('sha256')
      .update(clientIp + config.ipHashSalt)
      .digest('hex');

    req.ipHash = ipHash;

    // Check pg_identity cookie
    let identityId = req.cookies ? req.cookies.pg_identity : null;
    let validIdentity = false;
    const now = Date.now();

    if (identityId) {
      const cached = verifiedIdentitiesCache.get(identityId);
      if (cached && (now - cached.verifiedAt < CACHE_TTL_MS)) {
        validIdentity = true;
        // Non-blocking background update if last_seen_at is older than 10 mins
        if (now - cached.lastUpdated > UPDATE_THRESHOLD_MS) {
          cached.lastUpdated = now;
          prisma.identities.update({
            where: { id: identityId },
            data: { last_seen_at: new Date(), ip_hash: ipHash }
          }).catch((err) => {
            console.warn('[Identity] Background last_seen_at update failed:', err.message);
          });
        }
      } else {
        try {
          const existing = await prisma.identities.findUnique({
            where: { id: identityId }
          });
          if (existing) {
            validIdentity = true;
            verifiedIdentitiesCache.set(identityId, { verifiedAt: now, lastUpdated: now });
            // Non-blocking background update
            prisma.identities.update({
              where: { id: identityId },
              data: { last_seen_at: new Date(), ip_hash: ipHash }
            }).catch((err) => {
              console.warn('[Identity] Background last_seen_at update failed:', err.message);
            });
          }
        } catch (err) {
          // DB unreachable — log and fall through to create a new identity
          console.warn('[Identity] DB error during identity lookup, will create new identity:', err.message);
        }
      }
    }

    if (!validIdentity) {
      identityId = uuidv4();
      verifiedIdentitiesCache.set(identityId, { verifiedAt: now, lastUpdated: now });
      try {
        await prisma.identities.create({
          data: {
            id: identityId,
            ip_hash: ipHash,
            created_at: new Date(),
            last_seen_at: new Date()
          }
        }).catch(() => {});
      } catch (err) {
        // DB unreachable — identity lives in cache only for this session
        console.warn('[Identity] DB error during identity creation, running in cache-only mode:', err.message);
      }

      res.cookie('pg_identity', identityId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProduction, // Only send over HTTPS in production
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }

    req.identityId = identityId;
    next();
  } catch (error) {
    next(error);
  }
};
