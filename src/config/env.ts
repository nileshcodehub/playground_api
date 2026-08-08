/**
 * Environment Configuration Module
 * Rule: NEVER access process.env directly outside this file.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://playground-api-xi.vercel.app'
    : 'http://localhost:3000'
);

// Ensure HTTPS scheme in production for canonical links & SEO
const siteUrl = process.env.NODE_ENV === 'production' && rawSiteUrl.startsWith('http://')
  ? rawSiteUrl.replace('http://', 'https://')
  : rawSiteUrl;

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const envConfig = {
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl,
  publicApiUrl: apiUrl.startsWith('http') ? apiUrl : `${siteUrl}${apiUrl.startsWith('/') ? '' : '/'}${apiUrl}`,
  siteUrl,
  apiVersion: 'v1',
};

export default envConfig;



