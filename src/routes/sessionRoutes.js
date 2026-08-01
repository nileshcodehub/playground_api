import { Router } from 'express';
import { resetSession, getSessionStatsController } from '../controllers/sessionController.js';

const router = Router();

// Retrieve active session identity stats, quotas, and record breakdown
router.get('/stats', getSessionStatsController);

// Delete all overlay records for the current session sandbox
router.delete('/reset', resetSession);

// Alias POST route for clients/proxies restricting HTTP DELETE
router.post('/reset', resetSession);

export default router;
