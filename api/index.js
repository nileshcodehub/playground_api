import app from '../src/app.js';
import { initDb } from '../src/db/initDb.js';

let dbInitPromise = null;

export default async function handler(req, res) {
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((err) => {
      console.warn('[Vercel Init DB Warning]:', err.message);
      dbInitPromise = null;
    });
  }
  await dbInitPromise;
  return app(req, res);
}
