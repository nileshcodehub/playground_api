import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const base = config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1';
  const site = config.siteUrl || 'https://playground-api-xi.vercel.app';

  const manifest = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    name: 'Playground API',
    slug: 'playground-api',
    version: '1.0.0',
    category: [
      'mock-api',
      'api-sandbox',
      'developer-tool',
      'testing-tool',
      'graphql-sandbox',
    ],
    description:
      'Free, zero-configuration, stateful mock REST and GraphQL API sandbox for frontend development, prototyping, and testing.',
    website: site,
    documentation: `${site}/docs`,
    repository: 'https://github.com/nileshcodehub/playground_api',
    license: 'MIT',
    api: {
      base_url: base,
      rest: true,
      graphql: true,
      graphql_endpoint: `${base}/graphql`,
    },
    authentication: {
      required: false,
      jwt_simulation: true,
      login_endpoint: '/auth/login',
      refresh_endpoint: '/auth/refresh',
      profile_endpoint: '/auth/me',
    },
    state: {
      persistent: true,
      session_scoped: true,
      global_seed_data_mutable: false,
      retention_days: 10,
      max_overlay_records_per_resource: 30,
    },
    features: [
      'CRUD',
      'pagination',
      'filtering',
      'full-text-search',
      'multi-field-sorting',
      'network-delay-simulation',
      'http-error-simulation',
      'custom-collections',
      'svg-avatar-generation',
      'session-snapshots',
      'openapi-export',
      'postman-export',
      'bruno-export',
      'insomnia-export',
      'typescript-definitions',
    ],
    collections: [
      { name: 'posts', path: '/posts', count: 100 },
      { name: 'comments', path: '/comments', count: 300 },
      { name: 'users', path: '/users', count: 25 },
      { name: 'todos', path: '/todos', count: 125 },
      { name: 'auth', path: '/auth', type: 'JWT Simulation' },
      { name: 'custom', path: '/custom/:collection', type: 'Dynamic Schema-less' },
      { name: 'avatars', path: '/avatars/:seed', type: 'Vector SVG Generator' },
    ],
    audience: [
      'frontend-developers',
      'mobile-developers',
      'qa-engineers',
      'educators',
      'ai-coding-agents',
    ],
    specs: {
      openapi: `${base}/downloads/openapi.json`,
      postman: `${base}/downloads/postman.json`,
      bruno: `${base}/downloads/bruno.json`,
      insomnia: `${base}/downloads/insomnia.json`,
      typescript: `${base}/downloads/playground-api.d.ts`,
      llms: `${site}/llms.txt`,
      llms_full: `${site}/llms-full.txt`,
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
