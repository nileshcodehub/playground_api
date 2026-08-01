import express from 'express';
import { cleanupInactiveIdentities } from '../services/overlayService.js';
import config from '../config/env.js';

const router = express.Router();

router.get('/cleanup', async (req, res, next) => {
  try {
    // 1. Authorization check if CRON_SECRET is configured
    if (config.cronSecret) {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${config.cronSecret}`) {
        return res.status(401).json({
          error: {
            message: 'Unauthorized cron request. Invalid or missing Bearer CRON_SECRET.',
            status: 401
          }
        });
      }
    }

    // 2. Perform daily identity cleanup (purges identities inactive > 10 days)
    const purgedCount = await cleanupInactiveIdentities(10);

    return res.status(200).json({
      success: true,
      message: `Successfully purged ${purgedCount} inactive identity sandbox(es) older than 10 days.`,
      purgedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
