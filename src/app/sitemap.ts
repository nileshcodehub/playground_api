import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/docs',
    '/docs/introduction',
    '/docs/showcase',
    '/docs/export-import',
    '/docs/sandbox',
    '/docs/studio',
    '/docs/stats',
    '/docs/posts',
    '/docs/comments',
    '/docs/users',
    '/docs/todos',
    '/docs/auth',
    '/docs/custom',
    '/docs/avatars',
    '/docs/graphql',
    '/docs/collections/openapi',
    '/docs/collections/postman',
    '/docs/collections/bruno',
    '/docs/collections/insomnia',
    '/docs/collections/typescript',
    '/llms.txt',
    '/llms-full.txt',
  ];


  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
