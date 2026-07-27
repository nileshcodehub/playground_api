import app from './src/app.js';
import config from './src/config/env.js';
import { scheduleCleanupJob } from './src/jobs/cleanupInactiveIdentities.js';
import { initDb } from './src/db/initDb.js';

const PORT = config.port;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Playground API running on http://localhost:${PORT}`);
  console.log(`📚 Interactive Docs available at http://localhost:${PORT}/docs`);
  
  // Ensure database tables exist automatically in Neon DB
  await initDb();

  // Initialize daily identity cleanup cron job
  scheduleCleanupJob();
});

// Handle uncaught exceptions and unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Logging error:');
  console.error(err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Logging error:');
  console.error(err);
});
