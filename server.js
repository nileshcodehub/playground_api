import app from './src/app.js';
import config from './src/config/env.js';
import { scheduleCleanupJob } from './src/jobs/cleanupInactiveIdentities.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Playground API running on http://localhost:${PORT}`);
  console.log(`📚 Interactive Docs available at http://localhost:${PORT}/docs`);
  
  // Initialize daily identity cleanup cron job
  scheduleCleanupJob();
});

// Handle uncaught exceptions and unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Logging error:');
  console.error(err);
});1

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Logging error:');
  console.error(err);
});
