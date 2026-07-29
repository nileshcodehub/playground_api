# 🚀 Playground API

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.x-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.x-informational.svg)](https://www.prisma.io/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://playground-api-xi.vercel.app/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A **stateful, JSONPlaceholder-style mock REST API** built with **Node.js (ESM)**, **Express 5**, **Prisma ORM**, and **EJS**.

Playground API provides pre-seeded global baseline mock datasets (`users`, `posts`, `comments`, `todos`) while allowing visitors and client applications to execute `POST`, `PUT`, `PATCH`, and `DELETE` requests in a **sandboxed per-visitor session**. Shared global baseline data is never permanently mutated; instead, mutations are overlaid per identity session tied to an HTTP-only cookie (`pg_identity`).

🔗 **Live Deployment & Interactive Docs**: [https://playground-api-xi.vercel.app/](https://playground-api-xi.vercel.app/)

---

## ✨ Features & Architectural Highlights

- 🔒 **Sandboxed Session Overlay**: Every visitor gets an isolated sandbox overlay. Creates, updates, and deletes apply strictly to their session identity without altering shared global seed data.
- 🍪 **Anonymous Identity Cookie**: Identity sessions are resolved automatically via an HTTP-only cookie (`pg_identity`). Client IP addresses are hashed using SHA-256 with a salt strictly for rate limiting—raw IPs are never stored.
- ⚡ **Virtual Merging & Smart Pagination**:
  - `GET` requests build a virtual list: newly created items appear at the **top**, updates apply **in-place**, and deleted records are filtered out without renumbering integer IDs.
  - Slices the virtual ID list by `page` (default `1`) and `limit` (default `10`, max `30`) prior to database record fetching for high performance.
- 🛡️ **Sandbox Record Caps & Limits**: Identity sessions are capped at 30 user-created records per resource to prevent abuse.
- 🌐 **CORS & Credentials Support**: Configured with dynamic origin-reflecting CORS (`credentials: true`), making cross-origin requests from React, Vue, Next.js, or mobile applications seamless.
- 📄 **Interactive Hosted Documentation**: Server-rendered docs powered by **EJS** at `/` and `/docs` with dynamic endpoint catalog schemas ([`src/config/endpointsCatalog.js`](src/config/endpointsCatalog.js)) and an interactive browser-based request runner ([`public/js/try-it.js`](public/js/try-it.js)).
- ☁️ **Vercel Serverless & Neon DB Ready**: Optimized for serverless deployment on Vercel with zero-cold-start DB initialization ([`api/index.js`](api/index.js)) and connection pooling with Neon Serverless PostgreSQL.
- 🧹 **Automated Cleanup Job**: Background task ([`src/jobs/cleanupInactiveIdentities.js`](src/jobs/cleanupInactiveIdentities.js)) for purging inactive identities older than 10 days.

---

## 📡 API Endpoints

All standard list endpoints support pagination query parameters (`?page=1&limit=10`).

### 📦 Core Resource Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/users` | List users (merged global baseline + session sandbox overlay) |
| `GET` | `/users/:id` | Get user by ID (integer for global, string `local-<uuid>` for sandbox) |
| `POST` | `/users` | Create sandbox user record (max 30 created records per session) |
| `PUT` | `/users/:id` | Replace user record in session overlay |
| `PATCH` | `/users/:id` | Update specific user fields in session overlay |
| `DELETE` | `/users/:id` | Remove user record from session overlay |
| `GET` | `/posts` | List posts (supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |
| `GET` | `/comments` | List comments (supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |
| `GET` | `/todos` | List todos (supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |
| `ALL` | `/custom` | Mount point for dynamic custom resources |

### 📑 Hosted Documentation & System Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` or `/docs` | Hosted Documentation landing page |
| `GET` | `/docs/:resource` | Detailed resource documentation (`users`, `posts`, `comments`, `todos`) with live **Try It** runner |
| `GET` | `/health` | System health check & metrics (DB status, DB latency ms, uptime, active identities, memory usage) |
| `GET` | `/robots.txt` | Robots search engine indexing configuration |
| `GET` | `/sitemap.xml` | Dynamic XML sitemap for SEO |

---

## ⚙️ Environment Variables

Centralized variable loading and validation is handled exclusively in [`src/config/env.js`](src/config/env.js). Direct usage of `process.env` outside `env.js` is strictly forbidden per project conventions.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening HTTP server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string (Prisma / Neon DB) | `postgresql://postgres:postgres@localhost:5432/playground_api?schema=public` |
| `IP_HASH_SALT` | Secret salt string for SHA-256 IP hashing | `default_playground_salt_key` |
| `TRUST_PROXY` | Set `true` when deployed behind a reverse proxy (Nginx / Vercel / Cloudflare) | `false` |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` |

---

## 🛠️ Quick Start & Local Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/nileshcodehub/playground_api.git
cd playground_api
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and set your local PostgreSQL or Neon database URL:

```bash
cp .env.example .env
```

### 3. Database Migration & Prisma Client Generation

Generate Prisma Client and push database schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Baseline Mock Data

Populate database with baseline datasets (25 users, 100 posts, 300 comments, 125 todos):

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will run locally at `http://localhost:3000` and documentation at `http://localhost:3000/docs`.

---

## 🧪 Running Automated Tests

The repository includes automated unit and integration tests using Node's native test runner (`node:test`):

```bash
npm test
```

---

## 📁 Project Structure

```
playground_api/
├── .agents/                    # AI Agent skills, guidelines & task trackers
│   ├── AGENTS.md               # Project-wide mandatory coding rules
│   └── SKILLS_TODO.md          # Skill implementation tracker
├── api/
│   └── index.js                # Vercel serverless entry point & DB initializer
├── prisma/
│   └── schema.prisma           # Prisma schema (Identities, OverlayRecords, Globals)
├── public/
│   ├── css/
│   │   └── docs.css            # Developer documentation styling
│   ├── js/
│   │   └── try-it.js           # Live request runner script (with credentials)
│   ├── robots.txt              # SEO robots configuration
│   └── sitemap.xml             # Search engine XML sitemap
├── src/
│   ├── config/
│   │   ├── endpointsCatalog.js # Resource endpoint schemas & request/response examples
│   │   └── env.js              # Centralized environment configuration
│   ├── controllers/
│   │   └── resourceController.js # Generic REST CRUD controller factory
│   ├── db/
│   │   ├── initDb.js           # Runtime database initializer & fallback generator
│   │   ├── prismaClient.js     # Singleton Prisma Client instance
│   │   ├── seed.js             # Seed database runner script
│   │   └── seedData.js         # Global baseline datasets
│   ├── jobs/
│   │   └── cleanupInactiveIdentities.js # 10-day inactive identity purge job
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized Express error handler
│   │   ├── identity.js         # Cookie session & SHA-256 IP hashing middleware
│   │   └── rateLimit.js        # Global & mutation rate limiters
│   ├── routes/
│   │   ├── docsRoutes.js       # Hosted documentation & SEO router
│   │   └── resourceRoutes.js   # Generic Express resource router factory
│   ├── services/
│   │   └── overlayService.js   # Session overlay merging & virtual pagination engine
│   ├── utils/
│   │   └── sanitize.js         # Input sanitization helpers
│   └── app.js                  # Express app middleware & routing assembly
├── tests/
│   ├── app.test.js             # General app & 404 handler tests
│   ├── rateLimit.test.js       # Rate limiter unit tests
│   └── resources.test.js       # REST CRUD & sandbox mutation integration tests
├── views/
│   ├── layouts/
│   │   └── base.ejs            # EJS master layout template
│   ├── partials/
│   │   └── endpoint.ejs        # Interactive endpoint card component
│   ├── docs-index.ejs          # Hosted documentation landing page view
│   └── [resource].ejs          # Resource-specific docs pages (users, posts, etc.)
├── vercel.json                 # Vercel serverless deployment config
├── package.json                # NPM dependencies & scripts
├── README.md                   # Project documentation
└── server.js                   # Standalone Node.js server entry point
```

---

## 📄 License

[ISC](LICENSE) © Nilesh Kumar
