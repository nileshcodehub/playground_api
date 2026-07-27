import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import { identityMiddleware } from './middleware/identity.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { makeResourceRouter } from './routes/resourceRoutes.js';
import docsRouter from './routes/docsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();

// Configure view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

// Proxy trust setting if configured
if (config.trustProxy) {
  app.set('trust proxy', true);
}

// Global Core Middleware
// CORS: reflect origin only when one is present (safe for a public API).
// Avoids the dangerous combo of origin:true + credentials:true which would
// allow any cross-origin site to read credentialed responses.
app.use(cors({
  origin: (origin, callback) => callback(null, origin || false),
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
if (!config.isProduction) {
  app.use(morgan('dev'));
}

// Static file serving (bypasses DB identity check for speed)
app.use('/public', express.static(path.join(rootDir, 'public')));

// Identity Cookie Middleware & Global Rate Limiter
app.use(identityMiddleware);
app.use(generalLimiter);

// Resource API Routes (REST Data Endpoints)
app.use('/users', makeResourceRouter('users'));
app.use('/posts', makeResourceRouter('posts'));
app.use('/comments', makeResourceRouter('comments'));
app.use('/todos', makeResourceRouter('todos'));

// Placeholder mount point for custom resource
app.use('/custom', (req, res) => {
  res.json({ message: 'Custom resource placeholder. Logic will be added in future tasks.' });
});

// Hosted Developer Documentation Routes (Served directly at root / and /docs)
app.use('/', docsRouter);

// 404 Route Handler
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
