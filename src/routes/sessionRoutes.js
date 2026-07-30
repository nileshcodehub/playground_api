import { Router } from 'express';
import { resetSession } from '../controllers/sessionController.js';

const router = Router();

// Delete all overlay records for the current session sandbox
router.delete('/reset', resetSession);

// Alias POST route for clients/proxies restricting HTTP DELETE
router.post('/reset', resetSession);

export default router;
