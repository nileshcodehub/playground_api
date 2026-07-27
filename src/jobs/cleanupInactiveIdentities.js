import cron from 'node-cron';
import prisma from '../db/prismaClient.js';

export const scheduleCleanupJob = () => {
  // Run every day at 3:00 AM IST
  cron.schedule('0 3 * * *', async () => {
    console.log('[Cron Job] Starting inactive identities cleanup...');
    try {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const result = await prisma.identities.deleteMany({
        where: {
          last_seen_at: {
            lt: tenDaysAgo
          }
        }
      });
      console.log(`[Cron Job] Successfully purged ${result.count} inactive identities.`);
    } catch (error) {
      console.error('[Cron Job] Error purging inactive identities:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  console.log('[Cron Job] Cleanup schedule initialized (0 3 * * * IST).');
};
