import { execSync } from 'child_process';
import { seedDatabase } from './seed.js';

console.log('Pushing Prisma schema to database...');
try {
  const output = execSync('npx prisma db push', { encoding: 'utf-8' });
  console.log(output);
} catch (error) {
  console.error('Error running prisma db push:', error.stdout || error.message);
}

console.log('Seeding database...');
await seedDatabase();
console.log('Migration and seeding complete!');
