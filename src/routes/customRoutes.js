import { Router } from 'express';
import {
  listCollections,
  seedTemplate,
  listCustomRecords,
  getCustomRecord,
  createCustomRecord,
  updateCustomRecord,
  deleteCustomRecord
} from '../controllers/customController.js';

const router = Router();

// Collections Directory & Seed
router.get('/', listCollections);
router.post('/seed', seedTemplate);

// Custom Collection CRUD
router.get('/:collection', listCustomRecords);
router.get('/:collection/:id', getCustomRecord);
router.post('/:collection', createCustomRecord);
router.put('/:collection/:id', updateCustomRecord);
router.patch('/:collection/:id', updateCustomRecord);
router.delete('/:collection/:id', deleteCustomRecord);

export default router;
