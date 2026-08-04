import { Router } from 'express';
import { exportSession, importSession, resetSession, getSessionStatsController } from '../controllers/sessionController.js';

const router = Router();

// Retrieve active session identity stats, quotas, and record breakdown
router.get('/stats', getSessionStatsController);

router.get('/export', exportSession);
router.post('/import', importSession);
router.delete('/reset', resetSession);

export default router;

