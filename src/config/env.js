/**
 * Environment Configuration Module for Next.js Frontend
 * Rule: NEVER access process.env directly outside this file.
 */

const config = {
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiVersion: 'v1',
  jwtSecret: process.env.JWT_SECRET || 'default_playground_jwt_secret_key_2026',
  isVercel: Boolean(process.env.VERCEL)
};

export default config;
