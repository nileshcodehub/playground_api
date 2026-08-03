import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/playground_api?schema=public',
  ipHashSalt: process.env.IP_HASH_SALT || (() => { throw new Error('IP_HASH_SALT must be set'); })(),
  jwtSecret: process.env.JWT_SECRET || 'default_playground_jwt_secret_key_2026',
  trustProxy: process.env.TRUST_PROXY === 'true',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  isVercel: Boolean(process.env.VERCEL)
};

export default config;
