# 🚀 Playground API

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.x-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.x-informational.svg)](https://www.prisma.io/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://playground-api-xi.vercel.app/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A state-of-the-art, **stateful JSONPlaceholder-style mock REST API** built with **Node.js (ESM)**, **Express 5**, **Prisma ORM**, **Neon PostgreSQL**, and **EJS**.

Playground API provides pre-seeded, production-grade global baseline datasets (`users`, `posts`, `comments`, `todos`) while allowing developers, frontend engineers, and QA test suites to execute `POST`, `PUT`, `PATCH`, and `DELETE` mutations in an isolated, **zero-login per-visitor session sandbox**.

Shared global baseline data is **never permanently mutated**; instead, per-session mutations are virtualized over the global database using HMAC-SHA256 signed session tokens delivered via HTTP-only cookies (`pg_identity`) or the `X-Playground-Identity` header.

🔗 **Live Deployment & Interactive Developer Docs**: [https://playground-api-xi.vercel.app/](https://playground-api-xi.vercel.app/)

---

## ✨ Architectural Features & Capabilities

- 🔒 **Zero-Login Session Sandboxing**: Every visitor gets an isolated stateful sandbox overlay automatically. Creates (`local-<uuid>`), updates, and deletes apply strictly to their session identity without requiring user sign-in or altering shared global data.
- 🔑 **Option B HMAC Signed Session Tokens**: Identities are protected with HMAC-SHA256 token signatures. Works seamlessly via HTTP cookies (`pg_identity`) or cross-origin request headers (`X-Playground-Identity`).
- ⚡ **Virtual Merging & Smart Pagination Engine**:
  - `GET` operations build virtual lists: newly created records appear at the **top**, updates apply **in-place**, and deleted records are filtered out without ID renumbering.
  - Slices merged virtual ID lists prior to database record retrieval for optimal performance.
- 🔍 **Universal Full-Text Search (`?q=<term>`)**: Case-insensitive substring searching across all resource fields and nested objects in merged lists.
- 🔀 **Dynamic Sorting (`?_sort=<field>&_order=asc|desc`)**: Flexible multi-field sorting across merged baseline and sandbox records.
- 🔗 **Relational Sub-Resources & Filtering**:
  - Supports query parameter filtering: `GET /posts?user_id=1`, `GET /todos?user_id=1&completed=true`.
  - Supports nested relational routes: `GET /users/1/posts`, `GET /users/1/todos`, `GET /posts/1/comments`.
- ⏱️ **Network Delay & Error Simulation**:
  - Simulate latency: `X-Simulate-Delay: 1500` or `GET /posts?_delay=1500` (0–20,000ms).
  - Simulate HTTP errors: `X-Simulate-Status: 500` or `GET /posts?_status=404` (400–599 status codes).
- 📊 **Session Quota & Activity Dashboard Modal**: Interactive modal displaying real-time identity metrics, sandbox mutation counts, quota caps (max 30 created records per resource), and 10-day inactivity countdown TTL.
- 📦 **One-Click Multi-Format Schema Downloads**: Export OpenAPI 3.0 Specs, Postman Collections, Bruno Collections, and Insomnia Collections for all or individual resource collections.
- 🎨 **Responsive Developer Portal**: Dark Obsidian & Light Mode documentation built with EJS, Vanilla CSS grid/flex layout, horizontal snippet tab bar (cURL, Node fetch, Axios, Python, Go, Swift, Kotlin, Rust, PHP), and a mobile sidebar quick actions card.
- 🏥 **Health Check & Operational Metrics**: Real-time status at `GET /health` monitoring database connectivity, query latency ms, active session identities count, server uptime, and memory usage.

---

## 📡 API Endpoint Reference

All list endpoints support pagination (`?page=1&limit=10`), full-text search (`?q=term`), sorting (`?_sort=title&_order=desc`), and filtering (`?user_id=1`).

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

### 🔗 Relational Sub-Resource Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/users/:userId/posts` | List posts belonging to specific user |
| `GET` | `/users/:userId/todos` | List todos belonging to specific user |
| `GET` | `/posts/:postId/comments` | List comments belonging to specific post |

### 🛡️ Session Sandbox & Utility Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/session/stats` | Retrieve session quota usage, total records, and 10-day inactivity purge TTL |
| `DELETE` | `/session/reset` | Purge all session sandbox mutations and restore pristine global baseline |
| `POST` | `/session/reset` | Programmatically reset session sandbox |

### 📦 Collection Schema Downloads

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/downloads/openapi.json` | Download OpenAPI 3.0 Specification (`?resource=posts`) |
| `GET` | `/downloads/postman.json` | Download Postman Collection v2.1 (`?resource=posts`) |
| `GET` | `/downloads/bruno.json` | Download Bruno API Collection (`?resource=posts`) |
| `GET` | `/downloads/insomnia.json` | Download Insomnia Collection (`?resource=posts`) |

### 📑 Hosted Documentation & Operational Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` or `/docs` | Hosted Documentation landing page |
| `GET` | `/docs/:resource` | Detailed resource docs page (`users`, `posts`, `comments`, `todos`) |
| `GET` | `/health` | Health check & system operational metrics JSON |

---

## ⚙️ Environment Configuration

Centralized variable loading and validation is handled strictly in [`src/config/env.js`](src/config/env.js). Per project guidelines, direct usage of `process.env` outside `env.js` is prohibited.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening HTTP server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string (Prisma / Neon DB) | `postgresql://postgres:postgres@localhost:5432/playground_api?schema=public` |
| `IP_HASH_SALT` | Secret salt string for SHA-256 IP hashing | `default_playground_salt_key` |
| `TRUST_PROXY` | Set `true` when deployed behind a reverse proxy (Nginx / Vercel) | `false` |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` |

---

## 🛠️ Quick Start & Local Setup

### 1. Clone Repository & Install Dependencies

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

### 3. Migration & Prisma Client Generation

Generate Prisma Client and push database schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Baseline Datasets

Populate the database with initial baseline mock data (25 users, 100 posts, 300 comments, 125 todos):

```bash
npm run seed
```

### 5. Launch Local Development Server

```bash
npm run dev
```

The API server will listen locally at `http://localhost:3000` and hosted documentation at `http://localhost:3000/docs`.

---

## 🧪 Automated Testing

The project includes an automated test suite executed via Node's native runner (`node:test`):

```bash
npm test
```

**Test Suites (10 suites, 45 tests):**
- `tests/app.test.js` — General routing and 404 error handling
- `tests/resources.test.js` — REST CRUD operations & local ID assignment
- `tests/session.test.js` — Option B HMAC signed session tokens & reset API
- `tests/relational.test.js` — Relational sub-resources & query filtering
- `tests/search.test.js` — Universal full-text search (`?q=`)
- `tests/sort.test.js` — Dynamic sorting (`?_sort=&_order=`)
- `tests/simulation.test.js` — Artificial delay & HTTP status error simulation
- `tests/dashboard.test.js` — Session quota stats API
- `tests/downloads.test.js` — OpenAPI, Postman, Bruno, Insomnia download specs
- `tests/rateLimit.test.js` — Rate limiting headers and enforcement

---

## 📁 Project Structure

```
playground_api/
├── .agents/                    # AI Agent skills, guidelines & task trackers
│   └── AGENTS.md               # Project-wide mandatory coding guidelines
├── api/
│   └── index.js                # Vercel serverless entry point & DB connection bootstrapper
├── prisma/
│   └── schema.prisma           # Prisma schema (Identities, OverlayRecords, Globals)
├── public/
│   ├── css/
│   │   └── docs.css            # Developer portal design system & responsive layout
│   ├── js/
│   │   ├── endpoints-catalog.js# Client-side endpoint schema definitions
│   │   └── try-it.js           # Live Try-It tester, modal controllers & theme engine
│   ├── favicon.svg             # Brand favicon
│   ├── robots.txt              # SEO robots indexing configuration
│   └── sitemap.xml             # Search engine XML sitemap
├── src/
│   ├── config/
│   │   ├── endpointsCatalog.js # Server-side endpoint catalog definitions
│   │   └── env.js              # Centralized environment variable loader
│   ├── controllers/
│   │   ├── healthController.js # Operational metrics & health check controller
│   │   └── resourceController.js # Generic REST CRUD controller factory
│   ├── db/
│   │   ├── initDb.js           # Runtime DB bootstrapper
│   │   ├── migrateAndSeed.js   # Vercel deployment DB sync helper
│   │   ├── prismaClient.js     # Prisma client singleton
│   │   ├── seed.js             # Seed database runner script
│   │   └── seedData.js         # Global baseline mock datasets
│   ├── jobs/
│   │   └── cleanupInactiveIdentities.js # 10-day inactive identity purge task
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handling middleware
│   │   ├── identity.js         # Cookie & header HMAC session identity middleware
│   │   ├── rateLimit.js        # Global & mutation rate limiters
│   │   └── simulation.js       # Network delay & error simulation middleware
│   ├── routes/
│   │   ├── cronRoutes.js       # Vercel cron cleanup endpoint (/api/cron/cleanup)
│   │   ├── docsRoutes.js       # Documentation portal & resource views router
│   │   ├── downloadRoutes.js   # Multi-format schema collection downloads router
│   │   ├── resourceRoutes.js   # Generic Express resource router factory
│   │   └── sessionRoutes.js   # Session sandbox management & stats router
│   ├── services/
│   │   └── overlayService.js   # Virtual list merging, filtering & pagination engine
│   ├── utils/
│   │   ├── sanitize.js         # Input sanitization helpers
│   │   └── sessionToken.js     # HMAC-SHA256 session token signer & verifier
│   └── app.js                  # Express middleware & route assembly
├── tests/
│   ├── app.test.js             # General app & 404 tests
│   ├── dashboard.test.js       # Session quota stats tests
│   ├── downloads.test.js       # Schema download collection tests
│   ├── rateLimit.test.js       # Rate limiting tests
│   ├── relational.test.js      # Relational sub-resource tests
│   ├── resources.test.js       # REST CRUD & overlay tests
│   ├── search.test.js          # Full-text search tests
│   ├── session.test.js          # HMAC session & reset tests
│   ├── simulation.test.js       # Network simulation tests
│   └── sort.test.js            # Dynamic sorting tests
├── views/
│   ├── layouts/
│   │   └── base.ejs            # EJS master layout template
│   ├── partials/
│   │   ├── endpoint.ejs        # Endpoint card component with multi-language snippets
│   │   ├── explainer-modal.ejs # Sandboxing architecture explainer modal
│   │   ├── head.ejs            # Document head partial
│   │   └── sidebar.ejs         # Documentation navigation sidebar
│   ├── docs-index.ejs          # Hosted documentation landing view
│   └── [resource].ejs          # Resource docs pages (users, posts, comments, todos)
├── vercel.json                 # Vercel serverless deployment config
├── package.json                # NPM dependencies & test scripts
├── README.md                   # Project documentation
└── server.js                   # Standalone Node.js server entry point
```

---

## 📄 License

[ISC](LICENSE) © Nilesh Kumar
