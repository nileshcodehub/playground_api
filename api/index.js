import app from '../src/app.js';
import { initDb } from '../src/db/initDb.js';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
    } catch (err) {
      console.warn('[Vercel Init DB Warning]:', err.message);
    }
  }
  return app(req, res);
}
