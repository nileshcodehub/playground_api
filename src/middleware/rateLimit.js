import { rateLimit } from 'express-rate-limit';

const keyGenerator = (req) => {
  return req.ipHash || req.ip || '127.0.0.1';
};

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute per IP hash
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'Too many requests, please try again later.' }
});

export const mutationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 15, // 15 mutation requests per hour per IP hash
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'Mutation limit reached. You can only perform 15 mutations per hour.' }
});
