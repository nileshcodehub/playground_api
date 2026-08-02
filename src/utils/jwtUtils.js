import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * Sign an access token containing identityId and userId
 * Default expiration: 15 minutes (900 seconds)
 */
export const signAccessToken = (payload, expiresIn = '15m') => {
  return jwt.sign(
    {
      ...payload,
      token_type: 'access'
    },
    config.jwtSecret,
    { expiresIn }
  );
};

/**
 * Sign a refresh token containing identityId and userId
 * Default expiration: 7 days
 */
export const signRefreshToken = (payload, expiresIn = '7d') => {
  return jwt.sign(
    {
      ...payload,
      token_type: 'refresh'
    },
    config.jwtSecret,
    { expiresIn }
  );
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};
