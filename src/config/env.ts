/**
 * Environment Configuration Module
 * Rule: NEVER access process.env directly outside this file.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://playground-api-xi.vercel.app';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const cleanSite = (SITE_URL || 'https://playground-api-xi.vercel.app').replace(/\/+$/, '');
const cleanApi = API_URL.startsWith('/') ? API_URL : `/${API_URL}`;
const PUBLIC_API_URL = API_URL.startsWith('http') ? API_URL : `${cleanSite}${cleanApi}`;

const envConfig = {
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  port: 3000,
  siteUrl: cleanSite,
  apiUrl: cleanApi,
  publicApiUrl: PUBLIC_API_URL,
  apiVersion: 'v1',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-EN7KJL82XQ',
};

export default envConfig;
