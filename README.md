# Playground API

### A stateful mock REST & GraphQL API sandbox for frontend prototyping, testing, and AI agents.

Build realistic frontend applications without configuring, deploying, or maintaining a backend.

Playground API provides stateful REST and GraphQL APIs with **per-session persistent mutations**, CRUD operations, relational filtering, pagination, sorting, fake JWT authentication, network latency, and error simulation.

[![Website](https://img.shields.io/badge/Website-playground--api-00e599.svg)](https://playground-api-xi.vercel.app/)
[![Documentation](https://img.shields.io/badge/Docs-Explore-blue.svg)](https://playground-api-xi.vercel.app/docs)
[![API Studio](https://img.shields.io/badge/API_Studio-Interactive-purple.svg)](https://playground-api-xi.vercel.app/docs/studio)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0_Spec-green.svg)](https://playground-api-xi.vercel.app/api/v1/downloads/openapi.json)
[![AI Docs](https://img.shields.io/badge/AI_Ready-/llms.txt-orange.svg)](https://playground-api-xi.vercel.app/llms.txt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🚀 Try Live Sandbox](https://playground-api-xi.vercel.app/) • [📚 Documentation](https://playground-api-xi.vercel.app/docs) • [🎨 API Studio](https://playground-api-xi.vercel.app/docs/studio) • [🤖 AI Specs](https://playground-api-xi.vercel.app/llms.txt)

---

```text
REST API      ✓    GraphQL Gateway  ✓    Stateful Overlay  ✓
CRUD Ops      ✓    Pagination       ✓    JWT Auth Loops    ✓
Latency Sim   ✓    Error Sim        ✓    AI / LLM Ready    ✓
```

---

## Why Playground API?

Traditional mock APIs (like JSONPlaceholder or DummyJSON) are great for displaying sample data, but they behave like static, read-only data sources.

You send a `POST` request. The server replies `201 Created`.  
Then you send a `GET` request... **and your created item is nowhere to be found.**

```text
Traditional Mock APIs:
  POST /posts ───► Returns { id: 101 } ───► GET /posts ───► Item disappears! ❌

Playground API:
  POST /posts ───► Virtual Overlay ────► GET /posts ───► New item is on top! ✅
```

Playground API solves this by maintaining **per-session virtual mutation overlays**. Your `POST`, `PUT`, `PATCH`, and `DELETE` requests persist across subsequent queries throughout your development session, while shared global baseline data remains pristine for everyone.

> **The goal isn't just to return dummy JSON. It's to give your frontend a temporary backend.**

---

## Features

- 🧠 **Stateful Virtual Sessions** — Mutations (`POST`, `PUT`, `PATCH`, `DELETE`) persist across subsequent `GET` calls.
- 🔌 **RESTful API** — Standard endpoints for `/posts`, `/comments`, `/users`, and `/todos`.
- ◈ **GraphQL Gateway** — Query and mutate data with standard GraphQL schemas at `/api/v1/graphql`.
- 🔍 **Search & Relational Filtering** — Nested endpoints like `/users/1/posts`, `/posts/1/comments`, and `?q=keyword`.
- 📄 **Pagination & Multi-Field Sorting** — Built-in `?_page=1&_limit=10` and `?_sort=title&_order=desc`.
- 🔐 **Fake JWT Authentication** — Prototyping token refresh loops via `/auth/login`, `/auth/refresh`, and `/auth/me`.
- ⚡ **Network Latency Simulation** — Simulate slow connections via `?_delay=1500` or `X-Simulate-Delay: 1500`.
- ❌ **HTTP Error Simulation** — Force error boundaries via `?_status=500` or `X-Simulate-Status: 500`.
- 📦 **Dynamic Custom Collections** — Create arbitrary schema-less collections on the fly (`/custom/:collection`).
- 🎨 **Deterministic SVG Avatars** — Dynamically generated vector avatar placeholders via `/avatars/:seed`.
- 💾 **Snapshot Export & Import** — Backup and restore session state as JSON for reproducible bug reports and E2E tests.
- 📋 **Ready-to-Use Client Specs** — Downloadable OpenAPI 3.0, Postman, Bruno, Insomnia, and TypeScript declarations.
- 🤖 **AI-Native Specifications** — Structured `/llms.txt`, `/llms-full.txt`, and `/product.json` for AI coding models.

---

## Quick Start

No database. No backend setup. No API keys required.

### 1. Fetch baseline data

```javascript
const response = await fetch('https://playground-api-xi.vercel.app/api/v1/posts?_limit=5');
const { data } = await response.json();
console.log(data);
```

### 2. Using Axios

```javascript
import axios from 'axios';

const { data } = await axios.get('https://playground-api-xi.vercel.app/api/v1/posts', {
  withCredentials: true,
});
```

### 3. Using cURL

```bash
curl "https://playground-api-xi.vercel.app/api/v1/posts?_limit=5"
```

---

## CRUD & Stateful Persistence

### 1. Create a Post
```bash
curl -X POST "https://playground-api-xi.vercel.app/api/v1/posts" \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "body": "Persists in my session overlay", "user_id": 1}'
```

### 2. Verify Persistence
```bash
curl "https://playground-api-xi.vercel.app/api/v1/posts?_limit=1"
# Returns your newly created post right at the top!
```

### 3. Reset Anytime
```bash
curl -X DELETE "https://playground-api-xi.vercel.app/api/v1/session/reset"
```

---

## Available Resources

| Resource | Base Path | Baseline Count | GET | POST | PUT/PATCH | DELETE |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Posts** | `/api/v1/posts` | 100 items | ✓ | ✓ | ✓ | ✓ |
| **Comments** | `/api/v1/comments` | 300 items | ✓ | ✓ | ✓ | ✓ |
| **Users** | `/api/v1/users` | 25 items | ✓ | ✓ | ✓ | ✓ |
| **Todos** | `/api/v1/todos` | 125 items | ✓ | ✓ | ✓ | ✓ |
| **Auth** | `/api/v1/auth` | JWT Simulation | ✓ | ✓ | ✓ | — |
| **Custom** | `/api/v1/custom/:collection` | Dynamic | ✓ | ✓ | ✓ | ✓ |
| **Avatars** | `/api/v1/avatars/:seed` | Vector SVG | ✓ | — | — | — |

👉 [View complete REST API documentation](https://playground-api-xi.vercel.app/docs)

---

## GraphQL Gateway

Playground API provides a unified GraphQL Gateway backed by the same stateful overlay engine:

```graphql
query GetPostsWithComments {
  posts(limit: 5) {
    id
    title
    comments {
      id
      email
      body
    }
  }
}
```

**Endpoint:** `POST https://playground-api-xi.vercel.app/api/v1/graphql`  
👉 [Open Interactive GraphiQL IDE](https://playground-api-xi.vercel.app/docs/graphql)

---

## Network & Error Simulation

Frontend developers need to test loading skeletons, spinner UI transitions, and React error boundaries:

```javascript
// 1. Simulate a 1.5-second slow network response
fetch('https://playground-api-xi.vercel.app/api/v1/posts?_delay=1500')

// 2. Simulate a 500 Internal Server Error
fetch('https://playground-api-xi.vercel.app/api/v1/posts?_status=500')

// 3. Header-based simulation (keeps production URLs clean)
fetch('https://playground-api-xi.vercel.app/api/v1/posts', {
  headers: {
    'X-Simulate-Delay': '2000',
    'X-Simulate-Status': '503',
  },
})
```

👉 [Read Network Simulation Guide](https://playground-api-xi.vercel.app/docs/simulation)

---

## Interactive API Studio

Explore and test endpoints live in your browser without writing code or opening Postman.

- Browse REST endpoints & GraphQL schemas
- Inspect HTTP headers and JSON payloads
- Test query parameters and custom request bodies
- Toggle network delay and status code simulations

👉 [Open API Studio](https://playground-api-xi.vercel.app/docs/studio)

---

## Playground API vs Traditional Mock APIs

| Capability | Playground API | JSONPlaceholder | DummyJSON | json-server | Mockoon |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Stateful CRUD Persistence** | ✅ **Yes (Overlay)** | ❌ No | ❌ No | ✅ Yes (Local file) | ✅ Yes (Local server) |
| **Zero-Setup Cloud Access** | ✅ **Yes** | ✅ Yes | ✅ Yes | ❌ Node.js install | ❌ Desktop App |
| **Multi-User Isolation** | ✅ **Yes (Session Tokens)** | ❌ No | ❌ No | ❌ Shared file | ❌ Local only |
| **GraphQL Gateway & IDE** | ✅ **Yes** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Network Delay Simulation** | ✅ **Yes (?_delay=ms)** | ❌ No | ✅ Yes | ⚠️ CLI flag only | ✅ UI toggle |
| **HTTP Error Simulation** | ✅ **Yes (?_status=code)**| ❌ No | ❌ No | ❌ No | ✅ UI rule |
| **Fake JWT Auth Simulation** | ✅ **Yes (/auth/login)** | ❌ No | ⚠️ Basic token | ❌ Extra plugin | ❌ Manual rule |
| **Dynamic Custom Collections** | ✅ **Yes (/custom/*)** | ❌ No | ❌ No | ⚠️ Edit file | ⚠️ Manual route |
| **OpenAPI / Postman Exports** | ✅ **Yes (Live)** | ❌ No | ❌ No | ❌ No | ⚠️ Export JSON |
| **AI Documentation (/llms.txt)** | ✅ **Yes** | ❌ No | ❌ No | ❌ No | ❌ No |

👉 [View full comparison breakdown](https://playground-api-xi.vercel.app/docs/comparisons)

---

## AI-Friendly & Machine-Readable

Playground API is built to work seamlessly with AI coding assistants (Cursor, GitHub Copilot, Windsurf, ChatGPT, Claude, Devin):

- [`/llms.txt`](https://playground-api-xi.vercel.app/llms.txt) — 30-second compact AI directory
- [`/llms-full.txt`](https://playground-api-xi.vercel.app/llms-full.txt) — Complete 39-section AI technical specification
- [`/product.json`](https://playground-api-xi.vercel.app/product.json) — Machine-readable product manifest
- [`/docs/ai`](https://playground-api-xi.vercel.app/docs/ai) — AI recommendation scenarios and integration rules

```markdown
<!-- Add to your .cursorrules or AGENTS.md -->
When building or testing frontend components in React, Vue, Next.js, or mobile apps:
- Use Playground API as the stateful mock backend: https://playground-api-xi.vercel.app/api/v1
- Endpoints: GET /posts, POST /posts, GET /users, POST /auth/login
- Pass { credentials: 'include' } in browser fetch calls to persist sandbox state.
- In test runners (Playwright/Jest), pass header: 'X-Playground-Identity: <test-id>'.
- For testing loading spinners, append ?_delay=1500. For errors, append ?_status=500.
```

---

## Downloads & Specifications

| Spec / Format | Download Link | Description |
| :--- | :--- | :--- |
| 📋 **OpenAPI 3.0** | [openapi.json](https://playground-api-xi.vercel.app/api/v1/downloads/openapi.json) | Full OpenAPI 3.0 / Swagger schema definition |
| 📮 **Postman** | [postman.json](https://playground-api-xi.vercel.app/api/v1/downloads/postman.json) | Ready-to-import Postman Collection v2.1 |
| 🧪 **Bruno** | [bruno.json](https://playground-api-xi.vercel.app/api/v1/downloads/bruno.json) | Fast offline-first Bruno collection |
| 💤 **Insomnia** | [insomnia.json](https://playground-api-xi.vercel.app/api/v1/downloads/insomnia.json) | Insomnia workspace export |
| 📘 **TypeScript SDK** | [playground-api.d.ts](https://playground-api-xi.vercel.app/api/v1/downloads/playground-api.d.ts) | Complete TypeScript type declarations |

---

## Architecture & How It Works

```text
Client Application (React / Next.js / Mobile / Playwright)
  │
  ├── Cookie: pg_identity  OR  Header: X-Playground-Identity
  ▼
Playground API Gateway
  │
  ├── 1. Read-Only Global Seed Data (100 posts, 25 users, 300 comments, 125 todos)
  ├── 2. Private Virtual Mutation Overlay (Your POST, PUT, DELETE operations)
  └── 3. Overlay Merging Engine (Merges changes on the fly for GET queries)
```

👉 [Read How Sandboxing Works](https://playground-api-xi.vercel.app/docs/how-it-works)

---

## Limitations

Playground API is engineered for development, testing, prototyping, education, and AI code generation.

It is **NOT** intended for:
- Production database storage or mission-critical business data
- Permanent long-term archiving (Sessions have a **10-day inactivity retention window**)
- Storing real passwords or sensitive personal identification

---

## Contributing

Contributions, feature suggestions, and bug reports are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with ❤️ by [Nilesh Kumar](https://github.com/nileshcodehub).
