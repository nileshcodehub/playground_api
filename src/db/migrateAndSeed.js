// Deprecated script: Seeding and schema migrations are now handled via `npx prisma db push` and `npm run seed` (node src/db/seed.js).
import { seedDatabase } from './seed.js';

await seedDatabase();
