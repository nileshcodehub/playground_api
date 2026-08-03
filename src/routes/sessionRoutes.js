import { Router } from 'express';
import { exportSession, importSession, resetSession } from '../controllers/sessionController.js';

const router = Router();

router.get('/export', exportSession);
router.post('/import', importSession);
router.delete('/reset', resetSession);

export default router;
