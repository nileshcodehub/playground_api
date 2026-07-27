import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`[Database Init] schema.sql not found at ${schemaPath}`);
    return;
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

  // Split statements safely
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log('[Database Init] Verifying DDL schema tables in database...');

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('duplicate_object')) {
        console.warn(`[Database Init Warning] ${err.message.split('\n')[0]}`);
      }
    }
  }

  // Auto-seed baseline global data if database is empty
  try {
    const userCount = await prisma.usersGlobal.count();
    if (userCount === 0) {
      console.log('[Database Init] Global tables are empty. Auto-seeding base data...');
      
      const usersData = Array.from({ length: 25 }).map((_, i) => ({
        name: `User ${i + 1}`,
        username: `user_${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+1-555-010${(i + 1).toString().padStart(2, '0')}`,
        website: `https://user${i + 1}.dev`,
        address: { street: `${i + 1} Main St`, city: 'Metro City', zipcode: '10001' },
        company: { name: `Tech Corp ${i + 1}`, catchPhrase: 'Innovative solutions for all' }
      }));
      await prisma.usersGlobal.createMany({ data: usersData });

      const postsData = [];
      for (let u = 1; u <= 25; u++) {
        for (let p = 1; p <= 4; p++) {
          postsData.push({
            user_id: u,
            title: `Post ${p} by User ${u}`,
            body: `This is the body content of sample post #${p} written by user #${u} on Playground API.`
          });
        }
      }
      await prisma.postsGlobal.createMany({ data: postsData });

      const commentsData = [];
      for (let postId = 1; postId <= 100; postId++) {
        for (let c = 1; c <= 3; c++) {
          commentsData.push({
            post_id: postId,
            name: `Commenter ${c} on post ${postId}`,
            email: `commenter${c}_post${postId}@example.com`,
            body: `Insightful comment #${c} on post #${postId}.`
          });
        }
      }
      await prisma.commentsGlobal.createMany({ data: commentsData });

      const todosData = [];
      for (let u = 1; u <= 25; u++) {
        for (let t = 1; t <= 5; t++) {
          todosData.push({
            user_id: u,
            title: `Task #${t} for user #${u}`,
            completed: t % 2 === 0
          });
        }
      }
      await prisma.todosGlobal.createMany({ data: todosData });

      console.log('[Database Init] Auto-seeding complete! 25 users, 100 posts, 300 comments, 125 todos created.');
    } else {
      console.log(`[Database Init] Found ${userCount} existing global users in database.`);
    }
  } catch (seedErr) {
    console.error('[Database Init Error] Auto-seeding failed:', seedErr.message);
  }

  console.log('[Database Init] Database ready.');
}
