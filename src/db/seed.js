import prisma from './prismaClient.js';
import { initDb } from './initDb.js';

export async function seedDatabase() {
  console.log('Initializing database schema and seeding global datasets via Prisma...');

  try {
    // Ensure all tables exist in database
    await initDb();

    // Truncate existing global tables
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users_global", "posts_global", "comments_global", "todos_global" RESTART IDENTITY CASCADE;`).catch(() => {});

    // Seed Users (25 users)
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
    console.log('Seeded 25 global users.');

    // Seed Posts (4 posts per user = 100 posts)
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
    console.log('Seeded 100 global posts.');

    // Seed Comments (3 comments per post = 300 comments)
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
    console.log('Seeded 300 global comments.');

    // Seed Todos (5 todos per user = 125 todos)
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
    console.log('Seeded 125 global todos.');

    console.log('Database seeding complete successfully!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
