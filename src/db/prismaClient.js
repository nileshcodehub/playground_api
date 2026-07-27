import { PrismaClient } from '@prisma/client';
import config from '../config/env.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
  log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
