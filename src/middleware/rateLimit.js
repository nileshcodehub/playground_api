import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

const keyGenerator = (req, res) => {
  return req.ipHash || ipKeyGenerator(req, res);
};

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests per minute per IP hash
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  validate: { keyGeneratorIpFallback: false },
  message: { error: 'Too many requests, please try again later.' }
});

export const mutationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 15, // 15 mutation requests per hour per IP hash
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  validate: { keyGeneratorIpFallback: false },
  message: { error: 'Mutation limit reached. You can only perform 15 mutations per hour.' }
});

