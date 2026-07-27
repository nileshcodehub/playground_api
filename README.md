# 🚀 Playground API

A **JSONPlaceholder-style mock REST API** built with **Node.js (ESM)**, **Express.js**, **Prisma ORM**, and **EJS**.

Playground API provides pre-seeded global mock data (`users`, `posts`, `comments`, `todos`) while allowing visitors to perform `POST`, `PUT`, `PATCH`, and `DELETE` requests in a **sandboxed per-visitor session**. Shared data is never permanently mutated; instead, mutations are overlaid per identity session tied to an HTTP cookie (`pg_identity`).

---

## ✨ Features & Architectural Highlights

- 🔒 **Sandboxed Mutations**: Every visitor gets their own isolated overlay. Creates, updates, and deletes apply strictly to their session identity without modifying shared global data.
- 🍪 **Anonymous Identity Cookie**: Identies are resolved using an HTTP-only cookie (`pg_identity`). IP addresses are hashed using SHA-256 with salt strictly for rate limiting, never stored raw.
- ⚡ **Virtual Merging & Smart Pagination**:
  - `GET` requests construct a virtual list: newly created items appear at the **top**, updates apply **in-place**, and deleted records are removed without renumbering.
  - Slices the virtual ID list by `page` (default `1`) and `limit` (default `10`, max `30`) before querying global database rows.
- 🛡️ **Sandbox Record Cap**: Identies are capped at 30 user-created records per resource to prevent abuse.
- 🧹 **Automated Daily Purge**: A `node-cron` background task runs daily to purge identities and associated overlay records inactive for more than 10 days.
- 🐘 **Prisma ORM & Neon DB Support**: Seamless database migrations and access using Prisma ORM with full support for local PostgreSQL or Neon Serverless PostgreSQL.
- 📑 **Interactive Hosted Documentation**: Built-in static documentation pages rendered with **EJS** at `/docs` with a live browser-based request runner (`public/js/try-it.js`).
- ⚙️ **Centralized Configuration & Error Handling**: All environment variables are validated in [src/config/env.js](file:///home/nileshkumar/Documents/Self%20Project/playground_api/src/config/env.js) and consumed across all modules. Errors are processed in a single central middleware [src/middleware/errorHandler.js](file:///home/nileshkumar/Documents/Self%20Project/playground_api/src/middleware/errorHandler.js).

---

## 🛠️ Database Setup & Neon DB Integration

Playground API uses **Prisma ORM** for database migrations and queries. You can run PostgreSQL locally or connect to **Neon Serverless PostgreSQL**.

### Neon DB Connection Details

- **Host**: `ep-blue-glade-avfxgprc.c-11.us-east-1.aws.neon.tech`
- **Pooler Host**: `ep-blue-glade-avfxgprc-pooler.c-11.us-east-1.aws.neon.tech`
- **Database**: `neondb`
- **Role**: `neondb_owner`

To connect to Neon DB, format your `DATABASE_URL` in `.env` as follows:

```env
DATABASE_URL="postgresql://neondb_owner:<YOUR_PASSWORD>@ep-blue-glade-avfxgprc-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## ⚙️ Environment Variables

All environment variables are loaded and exported via [src/config/env.js](file:///home/nileshkumar/Documents/Self%20Project/playground_api/src/config/env.js). **Direct usage of `process.env` outside `env.js` is strictly disallowed in this codebase.**

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server listening port | `3000` |
| `DATABASE_URL` | PostgreSQL or Neon DB connection string | `postgresql://postgres:postgres@localhost:5432/playground_api?schema=public` |
| `IP_HASH_SALT` | Secret salt for SHA-256 client IP hashing | `default_playground_salt_key` |
| `TRUST_PROXY` | Set `true` if behind a reverse proxy (e.g. Nginx/Cloudflare) | `false` |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` |

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/nileshcodehub/playground_api.git
cd playground_api
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and adjust your configuration:

```bash
cp .env.example .env
```

### 3. Database Migration & Prisma Generation

Generate the Prisma Client and push the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Global Baseline Data

Populate the database with realistic global datasets (25 users, 100 posts, 300 comments, 125 todos):

```bash
npm run seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000` and interactive documentation at `http://localhost:3000/docs`.

---

## 📡 API Endpoints

### Core Resources
All standard endpoints support pagination (`?page=1&limit=10`).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/users` | List users (merged global + session overlay) |
| `GET` | `/users/:id` | Get user by ID (integer or `local-<uuid>`) |
| `POST` | `/users` | Create sandbox user record (max 30 records) |
| `PUT` | `/users/:id` | Replace user record in overlay |
| `PATCH` | `/users/:id` | Update user record patch in overlay |
| `DELETE` | `/users/:id` | Delete user record from session view |
| `GET` | `/posts` | List posts |
| `GET` | `/comments` | List comments |
| `GET` | `/todos` | List todos |
| `ALL` | `/custom` | Mount point for custom resources |

### Documentation & Interactive Tester
- `GET /docs` — Documentation index listing all resources.
- `GET /docs/:resource` — Detailed documentation page for `users`, `posts`, `comments`, or `todos` with live **Try It** request runner.

---

## 📁 Project Structure

```
playground_api/
├── .agents/                    # Agent skills, project rules & prompt tasks
│   ├── AGENTS.md               # Mandatory project guidelines
│   ├── prompts/                # Multi-step implementation prompts
│   └── skills/                 # Architectural & docs skill conventions
├── prisma/
│   └── schema.prisma           # Prisma models (Identities, OverlayRecords, Globals)
├── public/
│   ├── css/
│   │   └── docs.css            # Documentation stylesheet
│   └── js/
│       └── try-it.js           # Live request runner script (with credentials)
├── src/
│   ├── config/
│   │   └── env.js              # Centralized environment variable module
│   ├── controllers/
│   │   └── resourceController.js # Generic CRUD controller factory
│   ├── db/
│   │   ├── prismaClient.js     # Centralized Prisma Client
│   │   └── seed.js             # Database seeding script
│   ├── jobs/
│   │   └── cleanupInactiveIdentities.js # Daily cron purge task
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized Express error handler
│   │   ├── identity.js         # Cookie session & IP hashing middleware
│   │   └── rateLimit.js        # Global & mutation rate limiters
│   ├── routes/
│   │   ├── docsRoutes.js       # Documentation page router
│   │   └── resourceRoutes.js   # Generic Express router factory
│   ├── services/
│   │   └── overlayService.js   # Core overlay merging & virtual pagination engine
│   └── app.js                  # Express app pipeline assembly
├── views/
│   ├── layouts/
│   │   └── base.ejs            # Base HTML layout
│   ├── partials/
│   │   └── endpoint.ejs        # Endpoint card component with Try-It form
│   └── docs-index.ejs          # Documentation index view
├── .env.example                # Sample environment template
├── package.json                # Project dependencies & scripts
├── README.md                   # Project documentation
└── server.js                   # Entry point server listener
```

---

## 📄 License

[ISC](LICENSE) © Nilesh Kumar
