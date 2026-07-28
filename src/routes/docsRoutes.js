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

// In-memory cache for sample records to eliminate database latency on page loads
const sampleCache = new Map();

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
    resources: RESOURCES,
    currentNav: 'overview',
    identityId: req.identityId
  };

  res.render('docs-index', locals, (err, htmlContent) => {
    if (err) return next(err);
    res.render('layouts/base', {
      ...locals,
      body: htmlContent
    });
  });
});

// Alias for /docs
router.get('/docs', (req, res) => {
  res.redirect('/');
});

// Resource specific documentation page
router.get('/docs/:resource', async (req, res, next) => {
  const { resource } = req.params;
  if (!RESOURCES.includes(resource)) {
    return res.status(404).render('docs-index', {
      title: 'Documentation - Not Found',
      resources: RESOURCES,
      currentNav: 'overview',
      identityId: req.identityId,
      error: `Documentation page for resource "${resource}" not found.`
    });
  }

  let sampleRecord = sampleCache.get(resource) || null;
  const modelName = GLOBAL_MODELS[resource];

  // Populate sampleCache in the background if not cached yet, without blocking HTML render
  if (!sampleRecord && modelName && prisma[modelName]) {
    prisma[modelName].findFirst().then((rec) => {
      if (rec) sampleCache.set(resource, rec);
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
    resource,
    resources: RESOURCES,
    currentNav: resource,
    sampleRecord,
    endpoints,
    identityId: req.identityId
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

export default router;
