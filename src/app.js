import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import { identityMiddleware } from './middleware/identity.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { simulationMiddleware } from './middleware/simulation.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { makeResourceRouter } from './routes/resourceRoutes.js';
import { makeResourceController } from './controllers/resourceController.js';
import avatarRoutes from './routes/avatarRoutes.js';
import docsRouter from './routes/docsRoutes.js';
import cronRouter from './routes/cronRoutes.js';
import downloadRouter from './routes/downloadRoutes.js';
import sessionRouter from './routes/sessionRoutes.js';
import graphqlRouter from './routes/graphqlRoutes.js';
import authRouter from './routes/authRoutes.js';
import customRouter from './routes/customRoutes.js';
import { getHealth } from './controllers/healthController.js';

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
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Playground-Identity', 'X-Simulate-Delay', 'X-Simulate-Status'],
  exposedHeaders: ['X-Playground-Identity']
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
if (!config.isProduction) {
  app.use(morgan('dev'));
}

// Static file serving & Dynamic SVG Avatars / Thumbnails (bypasses DB identity check for speed)
app.use('/public', avatarRoutes);
app.use('/public', express.static(path.join(rootDir, 'public')));

// Identity Cookie Middleware, Global Rate Limiter & Network Simulation
app.use(identityMiddleware);
app.use(generalLimiter);
app.use(simulationMiddleware);

// Health Check & System Metrics Endpoint
app.get('/health', getHealth);

// Session Sandbox Management, Cron, Downloads & Auth Simulation Endpoints
app.use('/session', sessionRouter);
app.use('/auth', authRouter);
app.use('/custom', customRouter);
app.use('/api/cron', cronRouter);
app.use('/downloads', downloadRouter);
app.use('/graphql', graphqlRouter);

// Nested Sub-Resource Routes (JSONPlaceholder parity)
app.get('/users/:userId/posts', (req, res, next) => {
  req.resourceFilters = { user_id: req.params.userId };
  makeResourceController('posts').list(req, res, next);
});

app.get('/users/:userId/todos', (req, res, next) => {
  req.resourceFilters = { user_id: req.params.userId };
  makeResourceController('todos').list(req, res, next);
});

app.get('/posts/:postId/comments', (req, res, next) => {
  req.resourceFilters = { post_id: req.params.postId };
  makeResourceController('comments').list(req, res, next);
});

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
