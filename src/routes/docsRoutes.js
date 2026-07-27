import { Router } from 'express';
import prisma from '../db/prismaClient.js';

const router = Router();
export const RESOURCES = ['users', 'posts', 'comments', 'todos'];

const GLOBAL_MODELS = {
  users: 'usersGlobal',
  posts: 'postsGlobal',
  comments: 'commentsGlobal',
  todos: 'todosGlobal'
};

// In-memory cache for sample records to eliminate database latency on page loads
const sampleCache = new Map();

// Documentation Hub Landing Page
router.get('/', (req, res) => {
  res.render('docs-index', {
    title: 'Playground API — Developer Documentation',
    resources: RESOURCES,
    currentNav: 'overview',
    identityId: req.identityId
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

  if (!sampleRecord && modelName && prisma[modelName]) {
    try {
      sampleRecord = await prisma[modelName].findFirst();
      if (sampleRecord) {
        sampleCache.set(resource, sampleRecord);
      }
    } catch (err) {
      console.warn(`[Docs] Could not fetch sample data for ${resource}: ${err.message}`);
    }
  }

  const locals = {
    title: `${resource.toUpperCase()} — Playground API Docs`,
    resource,
    resources: RESOURCES,
    currentNav: resource,
    sampleRecord,
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
