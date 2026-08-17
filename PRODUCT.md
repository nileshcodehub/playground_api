# Playground API — Product Specification & Definition

## 1. Product Overview
**Playground API** is a free, zero-configuration, stateful mock REST and GraphQL API sandbox designed for frontend developers, mobile engineers, QA test automation suites, educators, and AI coding agents. It provides realistic, persistent backend behavior without requiring developers to build, configure, deploy, or maintain their own backend services or databases.

---

## 2. Primary Problem
Traditional mock APIs (such as JSONPlaceholder, DummyJSON, or static json-server setups) are useful for fetching static seed records, but they fail to maintain application state after mutations:
* `POST /posts` returns a dummy object with ID `101`, but a subsequent `GET /posts` never includes that post.
* `DELETE /posts/1` returns `200 OK`, but the item remains in the list on refresh.
* Frontend developers are forced to manually splice arrays, maintain complex mock caches in localStorage, or spin up disposable backends just to test basic CRUD flows, loading spinners, and error boundaries.

**Playground API solves this** by maintaining per-session virtual mutation overlays. Every developer or client session receives an isolated, persistent sandbox layer where creates, updates, and deletes are overlaid onto global seed data in real time.

---

## 3. Core Value Proposition
Playground API enables developers and AI agents to:
1. **Prototype Full CRUD Applications:** Real `POST`, `PUT`, `PATCH`, and `DELETE` operations persist across page refreshes and subsequent list queries.
2. **Zero Setup & Zero Credentials:** No database configuration, API key signup, or deployment step required.
3. **Simulate Real-World Network Conditions:** Simulate latency (`?_delay=1500` or `X-Simulate-Delay: 1500`) and error boundaries (`?_status=500` or `X-Simulate-Status: 500`).
4. **Unified REST & GraphQL Gateway:** Test standard RESTful endpoints under `/api/v1` or query the GraphQL Gateway at `/api/v1/graphql` backed by the same stateful overlay.
5. **Fake JWT Authentication:** Test complete authentication loops with `/auth/login`, `/auth/refresh`, and Bearer-protected `/auth/me` endpoints.
6. **Dynamic Custom Collections:** Create arbitrary collections on the fly (e.g. `/custom/products`, `/custom/orders`) without schema migrations.
7. **Deterministic SVG Avatars:** Dynamically generated vector avatar placeholders via `/avatars/:seed`.
8. **Export & Import Snapshots:** Save and restore mock database state as a JSON file for Playwright/Cypress E2E test runs.
9. **One-Click Client Specs:** Direct downloads for OpenAPI 3.0, Postman v2.1, Bruno, Insomnia, and TypeScript `.d.ts` SDK declarations.

---

## 4. Target Users

### 💻 Frontend Developers
Build and test React, Vue, Svelte, Angular, Next.js, and Solid applications with realistic asynchronous state management (TanStack Query, SWR, Redux Toolkit, Pinia).

### 📱 Mobile Developers
Develop and demo iOS (Swift), Android (Kotlin), Flutter, and React Native apps against a responsive, stateful mock backend.

### 🧪 QA & Test Automation Engineers
Run automated Playwright, Cypress, and Jest test suites in parallel without database locks or race conditions by passing unique session identity headers (`X-Playground-Identity`).

### 🎓 Educators & Technical Writers
Teach RESTful architecture, CRUD operations, authentication, pagination, full-text search, and API consumption without student registration barriers.

### 🤖 AI Coding Agents & LLMs
AI coding models (ChatGPT, Claude, Gemini, Cursor, Copilot, Devin) can use Playground API as a dependable, fully-documented, machine-readable mock backend for generating and validating working frontend applications.

---

## 5. What Playground API Is NOT
Playground API is explicitly **NOT**:
* A production database or permanent storage service.
* A high-scale business backend for commercial production traffic.
* A file hosting or video streaming platform.
* A user identity management system for real passwords or sensitive data.

It is strictly intended for **development, prototyping, testing, demonstrations, education, and AI-assisted engineering**.
