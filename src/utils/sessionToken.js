import crypto from 'crypto';
import config from '../config/env.js';

/**
 * Creates a signed session token: <uuid>.<signature>
 * Signed using HMAC-SHA256 with config.ipHashSalt
 */
export function createSignedToken(identityId) {
  if (!identityId) return null;
  const signature = crypto
    .createHmac('sha256', config.ipHashSalt)
    .update(identityId)
    .digest('hex');
  return `${identityId}.${signature}`;
}

/**
 * Verifies a signed session token.
 * If signature is valid, returns the identity UUID string.
 * If signature is invalid or tampered, returns null.
 */
export function verifySignedToken(signedToken) {
  if (!signedToken || typeof signedToken !== 'string') return null;

  const parts = signedToken.split('.');
  if (parts.length !== 2) return null;

  const [uuid, receivedSignature] = parts;
  if (!uuid || !receivedSignature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', config.ipHashSalt)
    .update(uuid)
    .digest('hex');

  const receivedBuf = Buffer.from(receivedSignature, 'hex');
  const expectedBuf = Buffer.from(expectedSignature, 'hex');

  if (receivedBuf.length !== expectedBuf.length) {
    return null;
  }

  if (crypto.timingSafeEqual(receivedBuf, expectedBuf)) {
    return uuid;
  }

  return null;
}
