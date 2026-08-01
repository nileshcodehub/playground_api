import prisma from '../db/prismaClient.js';

export const getHealth = async (req, res, next) => {
  try {
    let dbStatus = 'connected';
    let dbLatencyMs = 0;
    let activeIdentities = 0;

    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - startTime;
      activeIdentities = await prisma.identities.count();
    } catch (err) {
      dbStatus = 'disconnected';
      console.warn('[Health] Database health check failed:', err.message);
    }

    const isHealthy = dbStatus === 'connected';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      },
      activeIdentities,
      memory: {
        rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  } catch (error) {
    next(error);
  }
};
