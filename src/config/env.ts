/**
 * Environment Configuration Module
 * Rule: NEVER access process.env directly outside this file.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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


