import { Router } from 'express';
import { makeResourceController } from '../controllers/resourceController.js';
import { mutationLimiter } from '../middleware/rateLimit.js';

export const makeResourceRouter = (resource) => {
  const router = Router();
  const controller = makeResourceController(resource);

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', mutationLimiter, controller.create);
  router.put('/:id', mutationLimiter, controller.update);
  router.patch('/:id', mutationLimiter, controller.update);
  router.delete('/:id', mutationLimiter, controller.remove);

  return router;
};
