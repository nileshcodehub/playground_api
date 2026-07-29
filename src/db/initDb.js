import prisma from './prismaClient.js';

/**
 * Verifies database connection health on application startup.
 * Database schema definitions are managed via Prisma (`prisma/schema.prisma`).
 */
export async function initDb() {
  console.log('[Database Init] Verifying database connection...');

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[Database Init] Database connected and ready.');
  } catch (err) {
    console.error('[Database Init Error] Database connection failed:', err.message);
    throw err;
  }
}
