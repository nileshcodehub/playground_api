import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../db/prismaClient.js';
import { GLOBAL_MODELS } from '../services/overlayService.js';
import { getEndpointsForResource } from '../config/endpointsCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../../public');

const router = Router();
export const RESOURCES = ['users', 'posts', 'comments', 'todos'];

// In-memory cache for sample records with 1-hour TTL
const sampleCache = new Map();
const SAMPLE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Robots.txt handler
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile('robots.txt', { root: publicDir });
});

// Sitemap.xml handler
router.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile('sitemap.xml', { root: publicDir });
});

// Documentation Hub Landing Page
router.get('/', (req, res, next) => {
  const locals = {
    title: 'Playground API — Free Stateful Fake REST API for Prototyping & Testing',
    metaDescription: 'Playground API is a free stateful fake REST API for frontend prototyping & QA testing. Experience zero-config, session-isolated CRUD sandbox overlays on realistic mock data.',
    keywords: 'free fake rest api, mock api, jsonplaceholder alternative, sandbox rest api, frontend testing, mock data api, stateful mock api',
    canonicalUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    baseUrl: `${req.protocol}://${req.get('host')}`,
    resources: RESOURCES,
    currentNav: 'overview',
    identityId: req.identityId,
    signedToken: req.signedToken
  };

  res.render('docs-index', locals, (err, htmlContent) => {
    if (err) return next(err);
    res.render('layouts/base', {
      ...locals,
      body: htmlContent
    });
  });
});

// Developer Portal & API Studio Route (/docs)
router.get('/docs', (req, res, next) => {
  const locals = {
    title: 'Developer Portal & Interactive API Studio — Playground API',
    metaDescription: 'Complete Playground API developer portal featuring interactive quickstarts, REST API reference, GraphQL gateway, visual API Studio, SDK code generators, and quota monitoring.',
    keywords: 'playground api docs, developer portal, api studio, interactive mock api explorer, quickstart guide',
    canonicalUrl: `${req.protocol}://${req.get('host')}/docs`,
    baseUrl: `${req.protocol}://${req.get('host')}`,
    resources: RESOURCES,
    currentNav: 'docs-portal',
    identityId: req.identityId,
    signedToken: req.signedToken
  };

  res.render('docs-portal', locals, (err, htmlContent) => {
    if (err) return next(err);
    res.render('layouts/base', {
      ...locals,
      body: htmlContent
    });
  });
});

// GraphQL Gateway Documentation Page
router.get('/docs/graphql', (req, res, next) => {
  const locals = {
    title: 'GraphQL Sandbox Gateway Documentation & Interactive Runner — Playground API',
    metaDescription: 'Test stateful GraphQL queries, mutations, and Apollo/Relay integrations with per-session sandbox overlays on Playground API.',
    keywords: 'graphql mock api, sandbox graphql, graphql gateway, graphiql ide, stateful graphql, jsonplaceholder graphql',
    canonicalUrl: `${req.protocol}://${req.get('host')}/docs/graphql`,
    baseUrl: `${req.protocol}://${req.get('host')}`,
    resources: RESOURCES,
    currentNav: 'graphql',
    identityId: req.identityId,
    signedToken: req.signedToken
  };

  res.render('graphql-docs', locals, (err, htmlContent) => {
    if (err) return next(err);
    res.render('layouts/base', {
      ...locals,
      body: htmlContent
    });
  });
});

// Resource specific documentation page
router.get('/docs/:resource', async (req, res, next) => {
  const { resource } = req.params;
  if (!RESOURCES.includes(resource)) {
    const locals = {
      title: 'Documentation - Not Found',
      resources: RESOURCES,
      currentNav: 'overview',
      identityId: req.identityId,
      error: `Documentation page for resource "${resource}" not found.`
    };
    return res.render('docs-index', locals, (err, htmlContent) => {
      if (err) return next(err);
      res.status(404).render('layouts/base', {
        ...locals,
        body: htmlContent
      });
    });
  }

  const cached = sampleCache.get(resource);
  const now = Date.now();
  let sampleRecord = (cached && (now - cached.cachedAt < SAMPLE_CACHE_TTL_MS)) ? cached.record : null;
  const modelName = GLOBAL_MODELS[resource];

  // Populate sampleCache in the background if not cached yet, without blocking HTML render
  if (!sampleRecord && modelName && prisma[modelName]) {
    prisma[modelName].findFirst().then((rec) => {
      if (rec) sampleCache.set(resource, { record: rec, cachedAt: Date.now() });
    }).catch((err) => {
      console.warn(`[Docs] Background sample fetch warning for ${resource}: ${err.message}`);
    });
  }

  const endpoints = getEndpointsForResource(resource, sampleRecord);

  const locals = {
    title: `Fake ${resource.charAt(0).toUpperCase() + resource.slice(1)} REST API Endpoints & Docs — Playground API`,
    metaDescription: `Free mock REST API for /${resource}. Test GET, POST, PUT, and DELETE HTTP requests with session-isolated sandbox mutations and live interactive request runner.`,
    keywords: `fake ${resource} api, mock ${resource} endpoints, ${resource} rest api, jsonplaceholder ${resource}, test ${resource} api`,
    canonicalUrl: `${req.protocol}://${req.get('host')}/docs/${resource}`,
    baseUrl: `${req.protocol}://${req.get('host')}`,
    resource,
    resources: RESOURCES,
    currentNav: resource,
    sampleRecord,
    endpoints,
    identityId: req.identityId,
    signedToken: req.signedToken
  };

  res.render(resource, locals, (err, htmlContent) => {
    if (err) {
      return res.render('docs-index', {
        ...locals,
        title: `${resource.toUpperCase()} Docs Coming Soon`,
        info: `Documentation for "${resource}" is currently being prepared.`
      });
    }
    res.render('layouts/base', {
      ...locals,
      body: htmlContent
    });
  });
});

// Full TypeScript Definitions Endpoint (/types/ts)
router.get('/types/ts', (req, res) => {
  const filePath = path.join(publicDir, 'types', 'playground-api.d.ts');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(filePath);
});

export default router;
