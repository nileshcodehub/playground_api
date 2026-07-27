import prisma from './prismaClient.js';
import { initDb } from './initDb.js';
import {
  REALISTIC_USERS,
  REALISTIC_POST_TITLES,
  REALISTIC_POST_BODIES,
  REALISTIC_COMMENT_ENTRIES,
  REALISTIC_TODOS
} from './seedData.js';

export async function seedDatabase() {
  console.log('Initializing database schema and seeding global datasets via Prisma...');

  try {
    // Ensure all tables exist in database
    await initDb();

    // Truncate existing global tables
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users_global", "posts_global", "comments_global", "todos_global" RESTART IDENTITY CASCADE;`).catch(() => {});

    // Seed Users (25 users)
    const usersData = REALISTIC_USERS;
    await prisma.usersGlobal.createMany({ data: usersData });
    console.log('Seeded 25 global users with genuine data.');

    // Seed Posts (4 posts per user = 100 posts)
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
    console.log('Seeded 100 global posts with genuine content.');

    // Seed Comments (3 comments per post = 300 comments)
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
    console.log('Seeded 300 global comments with genuine data.');

    // Seed Todos (5 todos per user = 125 todos)
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
    console.log('Seeded 125 global todos with genuine data.');

    console.log('Database seeding completed successfully with genuine data!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
