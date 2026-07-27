import { Router } from 'express';

const router = Router();
export const RESOURCES = ['users', 'posts', 'comments', 'todos'];

router.get('/', (req, res) => {
  res.render('docs-index', {
    title: 'Playground API Documentation',
    resources: RESOURCES
  });
});

router.get('/:resource', (req, res, next) => {
  const { resource } = req.params;
  if (!RESOURCES.includes(resource)) {
    return res.status(404).render('docs-index', {
      title: 'Documentation - Not Found',
      resources: RESOURCES,
      error: `Documentation page for resource "${resource}" not found.`
    });
  }

  res.render(resource, {
    title: `${resource.toUpperCase()} - Playground API Docs`,
    resource,
    resources: RESOURCES
  }, (err, html) => {
    if (err) {
      // If specific template not created yet
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
