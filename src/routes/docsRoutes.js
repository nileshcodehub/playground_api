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

router.get('/', async (req, res) => {
  res.render('docs-index', {
    title: 'Playground API Documentation',
    resources: RESOURCES
  });
});

router.get('/:resource', async (req, res, next) => {
  const { resource } = req.params;
  if (!RESOURCES.includes(resource)) {
    return res.status(404).render('docs-index', {
      title: 'Documentation - Not Found',
      resources: RESOURCES,
      error: `Documentation page for resource "${resource}" not found.`
    });
  }

  let sampleRecord = null;
  const modelName = GLOBAL_MODELS[resource];
  if (modelName && prisma[modelName]) {
    try {
      sampleRecord = await prisma[modelName].findFirst();
    } catch (err) {
      console.warn(`[Docs] Could not fetch sample data for ${resource}: ${err.message}`);
    }
  }

  res.render(resource, {
    title: `${resource.toUpperCase()} - Playground API Docs`,
    resource,
    resources: RESOURCES,
    sampleRecord
  }, (err, html) => {
    if (err) {
      return res.render('docs-index', {
        title: `${resource.toUpperCase()} Docs Coming Soon`,
        resources: RESOURCES,
        info: `Documentation for "${resource}" is currently being prepared.`
      });
    }
    res.send(html);
  });
});

export default router;
