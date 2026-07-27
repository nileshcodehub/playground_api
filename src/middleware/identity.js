import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/env.js';
import prisma from '../db/prismaClient.js';

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

    if (identityId) {
      try {
        const existing = await prisma.identities.findUnique({
          where: { id: identityId }
        });
        if (existing) {
          validIdentity = true;
          // Update last_seen_at
          await prisma.identities.update({
            where: { id: identityId },
            data: { last_seen_at: new Date(), ip_hash: ipHash }
          }).catch(() => {});
        }
      } catch (err) {
        // DB unreachable fallback
      }
    }

    if (!validIdentity) {
      identityId = uuidv4();
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
        // DB unreachable fallback
      }

      res.cookie('pg_identity', identityId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }

    req.identityId = identityId;
    next();
  } catch (error) {
    next(error);
  }
};
