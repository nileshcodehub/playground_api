import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prismaClient.js';
import {
  REALISTIC_USERS,
  REALISTIC_POST_TITLES,
  REALISTIC_POST_BODIES,
  REALISTIC_COMMENT_ENTRIES,
  REALISTIC_TODOS
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';

  let i = 0;
  while (i < sql.length) {
    const char = sql[i];

    // Check for dollar quotes ($$ or $tag$)
    if (char === '$') {
      const match = sql.slice(i).match(/^(\$[a-zA-Z0-9_]*\$)/);
      if (match) {
        const tag = match[1];
        if (!inDollarQuote) {
          inDollarQuote = true;
          dollarTag = tag;
        } else if (tag === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
        }
        current += tag;
        i += tag.length;
        continue;
      }
    }

    if (char === ';' && !inDollarQuote) {
      if (current.trim().length > 0) {
        statements.push(current.trim());
      }
      current = '';
      i++;
      continue;
    }

    current += char;
    i++;
  }

  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements;
}

export async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`[Database Init] schema.sql not found at ${schemaPath}`);
    return;
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

  // Split SQL statements safely, respecting $$ ... $$ dollar-quoted blocks
  const statements = splitSqlStatements(sqlContent);

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

  // Auto-seed baseline global data if database is empty or contains old dummy data ("User 1")
  try {
    const firstUser = await prisma.usersGlobal.findFirst();
    const isDummyData = !firstUser || (firstUser.name && firstUser.name.startsWith('User '));

    if (isDummyData) {
      console.log('[Database Init] Old dummy data or empty database detected. Truncating & re-seeding NeonDB with genuine data...');
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users_global", "posts_global", "comments_global", "todos_global" RESTART IDENTITY CASCADE;`).catch(() => {});

      const usersData = REALISTIC_USERS;
      await prisma.usersGlobal.createMany({ data: usersData });

      const postsData = [];
      let titleIdx = 0;
      let bodyIdx = 0;
      for (let u = 1; u <= 25; u++) {
        for (let p = 1; p <= 4; p++) {
          const title = REALISTIC_POST_TITLES[titleIdx % REALISTIC_POST_TITLES.length];
          const body = REALISTIC_POST_BODIES[bodyIdx % REALISTIC_POST_BODIES.length];
          postsData.push({
            user_id: u,
            title: p === 1 ? title : `${title} (Part ${p})`,
            body
          });
          titleIdx++;
          bodyIdx++;
        }
      }
      await prisma.postsGlobal.createMany({ data: postsData });

      const commentsData = [];
      let commentIdx = 0;
      for (let postId = 1; postId <= 100; postId++) {
        for (let c = 1; c <= 3; c++) {
          const template = REALISTIC_COMMENT_ENTRIES[commentIdx % REALISTIC_COMMENT_ENTRIES.length];
          commentsData.push({
            post_id: postId,
            name: template.name,
            email: template.email,
            body: template.body
          });
          commentIdx++;
        }
      }
      await prisma.commentsGlobal.createMany({ data: commentsData });

      const todosData = [];
      let todoIdx = 0;
      for (let u = 1; u <= 25; u++) {
        for (let t = 1; t <= 5; t++) {
          const template = REALISTIC_TODOS[todoIdx % REALISTIC_TODOS.length];
          todosData.push({
            user_id: u,
            title: template.title,
            completed: template.completed
          });
          todoIdx++;
        }
      }
      await prisma.todosGlobal.createMany({ data: todosData });

      console.log('[Database Init] Auto-seeding complete! 25 users, 100 posts, 300 comments, 125 todos created with genuine content.');
    } else {
      const userCount = await prisma.usersGlobal.count();
      console.log(`[Database Init] Found ${userCount} existing genuine global users in NeonDB.`);
    }
  } catch (seedErr) {
    console.error('[Database Init Error] Auto-seeding failed:', seedErr.message);
  }

  console.log('[Database Init] Database ready.');
}
