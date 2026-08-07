# 🚀 Playground API — Frontend & Interactive Developer Portal

[![Next.js](https://img.shields.io/badge/Next.js-v15.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-blue.svg)](https://www.typescriptlang.org/)
[![Express 5](https://img.shields.io/badge/Express-v5.0-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.x-informational.svg)](https://www.prisma.io/)
[![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00e599.svg)](https://neon.tech/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://playground-api-xi.vercel.app/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A state-of-the-art, **stateful mock REST & GraphQL API developer portal** built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

Playground API solves the biggest flaw of standard mock APIs (like JSONPlaceholder): **mutations actually persist in an isolated, zero-login per-visitor sandbox overlay**. When you execute `POST`, `PUT`, `PATCH`, or `DELETE`, your changes remain visible across page reloads and API calls without altering shared global baseline data or affecting other users.

🔗 **Live Portal Application**: [https://playground-api-xi.vercel.app/](https://playground-api-xi.vercel.app/)  
📖 **Interactive Documentation**: [https://playground-api-xi.vercel.app/docs](https://playground-api-xi.vercel.app/docs)  
🧰 **Interactive API Studio**: [https://playground-api-xi.vercel.app/docs/studio](https://playground-api-xi.vercel.app/docs/studio)  
🪐 **GraphQL Explorer**: [https://playground-api-xi.vercel.app/docs/graphql](https://playground-api-xi.vercel.app/docs/graphql)  
🤖 **AI Agent Documentation**: [https://playground-api-xi.vercel.app/llms.txt](https://playground-api-xi.vercel.app/llms.txt)

---

## ⚡ Playground API vs Traditional Mock APIs

| Feature | Traditional Mock APIs (JSONPlaceholder, ReqRes) | 🚀 Playground API |
| :--- | :--- | :--- |
| **Mutation Persistence** | ❌ None (Fake response with ID 101, disappears immediately) | ✅ **Stateful Session Sandbox** (Mutations persist per visitor) |
| **User Sign-In Required?** | ❌ N/A | ✅ **Zero Login Required** (Auto HMAC signed identity tokens) |
| **API Protocols** | REST only | ✅ **REST v1 + Full GraphQL Gateway** |
| **Network Latency Testing** | ❌ Fixed static response speed | ✅ **Simulate Delay (`?_delay=1500`) & Error Statuses (`?_status=500`)** |
| **Authentication Testing** | ❌ Hardcoded tokens | ✅ **Fake JWT Login, Register & Bearer Profile (`/auth/*`)** |
| **Full-Text Search & Sorting** | ❌ Basic or limited | ✅ **Universal Substring Search (`?q=`) & Multi-Field Sorting (`?_sort=`)** |
| **Schema Exporters** | ❌ None | ✅ **One-Click OpenAPI 3.0, Postman, Bruno, Insomnia & TypeScript SDK (.d.ts)** |
| **State Portability** | ❌ None | ✅ **Snapshot Export & Import JSON** |

---

## ✨ Features & Platform Capabilities

### 🎨 Frontend Portal Features (`playground_api_fe`)
- ⚡ **Next.js 15 App Router Architecture**: Built with modern server and client components, static site generation (SSG), dynamic routes, and zero layout shift.
- 🔀 **Transparent API Proxy Rewrites**: 
  - All frontend API calls to `/api/*` transparently proxy to the backend server (`playground-api-backend.vercel.app`).
  - Same-origin execution eliminates CORS errors and hides backend domain details.
- 🎨 **Obsidian Dark & Light Theme System**: Tailored HSL color system, glassmorphic cards, custom thin scrollbars, and full mobile-responsive sidebar navigation.
- 🧰 **Interactive API Studio**: Test `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests in real-time with dynamic query params, body editors, header simulation controls, and raw JSON response inspectors.
- 🪐 **GraphQL Explorer & GraphiQL IDE**: Full interactive IDE to write, test, and validate GraphQL queries and mutations over sandboxed data.
- 📊 **Session Sandbox Quota & Activity Modal**: Real-time status pill and activity modal displaying active sandbox mutations, resource quotas (max 30 created items per collection), and 10-day inactivity countdown TTL.
- 💾 **State Snapshot Export & Import**: Export your active session overlay state as a JSON file and restore it anytime to resume testing.
- 📦 **One-Click Schema Downloads**: Download OpenAPI 3.0 Specs, Postman Collections, Bruno Collections, Insomnia Collections, and TypeScript SDK definitions (`.d.ts`).
- 🛡️ **Comprehensive Security Headers**: Pre-configured in `vercel.json` and `next.config.mjs` with strict Content-Security-Policy (CSP), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, and `Permissions-Policy`.
- 🤖 **AI-Native & LLM Ready**: Includes `/llms.txt` and `/llms-full.txt` endpoints formatted for AI assistants (ChatGPT, Claude, Perplexity).

### ⚙️ Backend Engine Capabilities (`playground_api_be`)
- 🔒 **HMAC-SHA256 Signed Session Tokens**: Identities are protected with HMAC signatures delivered via `pg_identity` HTTP-only cookies or `X-Playground-Identity` request headers.
- ⚡ **Virtual Merging & Smart Pagination Engine**:
  - `GET` requests construct virtual lists: new creations appear at the **top**, updates apply **in-place**, and deletes are filtered out without ID renumbering.
- 🔗 **Relational Sub-Resources & Query Filtering**: Filter resources via `?user_id=1` or nested routes like `GET /users/1/posts` and `GET /posts/1/comments`.
- ⏱️ **Network Delay & Error Simulation**: Test frontend loading indicators (`X-Simulate-Delay: 1500`) and error boundaries (`X-Simulate-Status: 500`).
- 🎨 **Custom Collections & Media Helpers**: Create dynamic endpoints on the fly (`POST /custom/products`) and generate seed-based placeholder images (`GET /avatars/:seed.svg`).
- 🏥 **Health Check & Metrics**: Monitor server uptime, active session count, database latency, and memory usage at `GET /health`.

---

## 📡 Complete API Endpoint Reference

All REST list endpoints support pagination (`?page=1&limit=10`), full-text search (`?q=javascript`), sorting (`?_sort=title&_order=desc`), and filtering (`?user_id=1`).

### 📦 Core REST Resources (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users` | List users (merged baseline global seed + visitor session overlay) |
| `GET` | `/api/v1/users/:id` | Get user by ID (integer for baseline, string `local-<uuid>` for sandbox) |
| `POST` | `/api/v1/users` | Create sandbox user record (max 30 created records per session) |
| `PUT` | `/api/v1/users/:id` | Replace user record in session overlay |
| `PATCH` | `/api/v1/users/:id` | Update specific user fields in session overlay |
| `DELETE` | `/api/v1/users/:id` | Remove user record from session overlay |
| `GET` | `/api/v1/posts` | List posts (supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |
| `GET` | `/api/v1/comments` | List comments (supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |
| `GET` | `/api/v1/todos` | List todos (supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`) |

### 🔗 Relational Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users/:userId/posts` | List posts belonging to specific user |
| `GET` | `/api/v1/users/:userId/todos` | List todos belonging to specific user |
| `GET` | `/api/v1/posts/:postId/comments` | List comments belonging to specific post |

### 🔑 Authentication Simulation (`/api/v1/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Login with credentials returning JWT access token & user profile |
| `POST` | `/api/v1/auth/register` | Register new user profile |
| `POST` | `/api/v1/auth/refresh` | Refresh JWT access token |
| `GET` | `/api/v1/auth/me` | Get current user profile using `Authorization: Bearer <token>` |

### 🪐 GraphQL & Custom Resources

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/graphql` | GraphQL Gateway supporting queries and mutations |
| `GET` | `/api/v1/custom/:resource` | Fetch dynamic custom collection items (e.g. `/custom/products`) |
| `POST` | `/api/v1/custom/:resource` | Create dynamic custom resource item |
| `GET` | `/avatars/:seed.svg` | Dynamic SVG avatar image generator |

### 🛡️ Session Sandbox & Downloads

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/session/stats` | Retrieve active session metrics, quota usage, and 10-day purge TTL |
| `DELETE` | `/api/v1/session/reset` | Reset session sandbox and restore pristine global baseline |
| `GET` | `/api/v1/session/export` | Download active sandbox overlay snapshot JSON |
| `POST` | `/api/v1/session/import` | Restore sandbox state from uploaded snapshot JSON |
| `GET` | `/api/v1/downloads/openapi.json` | Download OpenAPI 3.0 Specification |
| `GET` | `/api/v1/downloads/postman.json` | Download Postman Collection v2.1 |
| `GET` | `/api/v1/downloads/bruno.json` | Download Bruno API Collection |
| `GET` | `/api/v1/downloads/insomnia.json` | Download Insomnia Collection |
| `GET` | `/api/v1/downloads/playground-api.d.ts` | Download TypeScript SDK definitions |

---

## 💻 Quick Code Examples

### JavaScript / TypeScript (`fetch`)
```typescript
// Fetch posts with search and pagination
const response = await fetch('https://playground-api-xi.vercel.app/api/v1/posts?_limit=5&q=javascript');
const posts = await response.json();
console.log(posts);

// Create a new post in your session sandbox
const createRes = await fetch('https://playground-api-xi.vercel.app/api/v1/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Custom Sandbox Post',
    body: 'This post is saved in my isolated visitor sandbox overlay.',
    userId: 1,
  }),
});
const newPost = await createRes.json();
console.log('Created Sandbox Post:', newPost);
```

### cURL
```bash
# Test network latency (1.5s delay) and create post
curl -X POST "https://playground-api-xi.vercel.app/api/v1/posts?_delay=1500" \
  -H "Content-Type: application/json" \
  -d '{"title": "Testing Latency", "body": "Simulating slow network connection", "userId": 1}'
```

---

## ⚙️ Environment Configuration

Frontend configuration is centralized in [`src/config/env.ts`](src/config/env.ts).

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Local Next.js dev server port | `3000` |
| `NEXT_PUBLIC_API_URL` | Relative or absolute API endpoint path | `/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Public canonical site URL | `https://playground-api-xi.vercel.app` |
| `BACKEND_URL` | Local proxy backend target for `next dev` | `http://localhost:3001` |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` |

---

## 🛠️ Quick Start & Local Setup

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/nileshcodehub/playground_api.git
cd playground_api_fe
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Launch Local Development Server

Start the backend server in `playground_api_be` on port 3001, then launch Next.js:

```bash
npm run dev
```

The app will start at `http://localhost:3000`. Next.js rewrites will proxy `/api/*` to `http://localhost:3001/api/*`.

### 4. Build & Production Verification

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
playground_api_fe/
├── public/                     # Static assets (favicons, icons, manifest)
├── src/
│   ├── app/                    # Next.js App Router pages & layouts
│   │   ├── docs/               # Documentation pages ([resource], studio, stats, sandbox, etc.)
│   │   ├── layout.tsx          # Root layout with metadata & providers
│   │   ├── page.tsx            # Home landing page
│   │   ├── llms.txt/           # AI Agent overview endpoint
│   │   └── llms-full.txt/      # Full AI reference specification endpoint
│   ├── components/
│   │   ├── dashboard/          # SandboxPill, StatsModal components
│   │   ├── docs/               # EndpointCard, TryItRunner, CodeGenerators
│   │   ├── landing/            # HeroSection, ResourceGrid, QuickstartTabs
│   │   ├── layout/             # Header, Footer, Sidebar, Navigation
│   │   └── theme/              # ThemeProvider & theme toggle controls
│   ├── config/
│   │   ├── api-catalog.ts      # Endpoint schemas & documentation catalog
│   │   ├── env.ts              # Environment variable loader
│   │   └── site.ts             # Site metadata & navigation structure
│   ├── lib/                    # JSON-LD & utility helpers
│   ├── styles/                 # Global CSS & Tailwind styling
│   └── utils/                  # Collection export generators
├── .env.example                # Environment template
├── next.config.mjs             # Next.js configuration & local dev rewrites
├── postcss.config.mjs          # PostCSS Tailwind plugin config
├── tsconfig.json               # TypeScript compiler config
└── vercel.json                 # Vercel deployment rewrites & security headers
```

---

## 📄 License

[ISC](LICENSE) © Nilesh Kumar


