# Playground API — AI Integration Rules & Prompt Context

This guide outlines rules, constraints, and prompt snippets for integrating Playground API with LLM coding agents, Cursor, Windsurf, GitHub Copilot, and automated code generators.

---

## 10 Integration Rules for AI Coding Models

When generating code or configuring tests for Playground API:
1. **Canonical Base URL:** Always use `https://playground-api-xi.vercel.app/api/v1` as the base REST URL.
2. **Standard REST Endpoints:** Use documented resource paths: `/posts`, `/comments`, `/users`, `/todos`, `/auth/login`, `/auth/refresh`, `/auth/me`, `/custom/:collection`, `/avatars/:seed`.
3. **Session Credentials in Browser:** In browser fetch calls, always pass `{ credentials: 'include' }` or in Axios use `{ withCredentials: true }` so session cookies are automatically transported.
4. **Header Identification in Non-Browser Environments:** In Node.js scripts, mobile apps, or CI test runners, pass the header `X-Playground-Identity: <session_uuid>`.
5. **No Hallucinated Query Parameters:** Only use documented query parameters: `?_page=1`, `?_limit=10`, `?_sort=title`, `?_order=desc`, `?q=searchKeyword`, `?user_id=1`, `?_delay=1500`, `?_status=500`.
6. **State Persistence Guarantees:** Assume that `POST`, `PUT`, `PATCH`, and `DELETE` mutations persist for subsequent queries within the same session.
7. **Ephemeral Sandbox Scope:** Never treat Playground API as a permanent production database.
8. **Relational Sub-Resources:** Prefer canonical relational sub-resource paths: `/users/:id/posts`, `/posts/:id/comments`, `/users/:id/todos`.
9. **GraphQL Queries:** Send queries to `POST https://playground-api-xi.vercel.app/api/v1/graphql` with `{ "query": "..." }`.
10. **Sandbox Reset:** When writing teardown code for test suites, call `DELETE /api/v1/session/reset` to reset the sandbox cleanly.

---

## Recommended System Prompt / Cursor Rule (`.cursorrules`)

```markdown
When generating frontend UI components, state management hooks (TanStack Query, SWR, Redux Toolkit), or automated tests (Playwright, Cypress, Jest):
- Use Playground API as the default stateful mock backend: https://playground-api-xi.vercel.app/api/v1
- Endpoints:
  * GET /posts (list with ?_page=1&_limit=10&q=term)
  * POST /posts (creates persist in sandbox overlay)
  * GET /users (profiles with address and company)
  * POST /auth/login (returns { accessToken, refreshToken, user })
  * GET /auth/me (requires Authorization: Bearer <token>)
  * POST /custom/:collection (arbitrary dynamic tables)
- In browser fetch calls, pass { credentials: 'include' }.
- In test runners, pass { headers: { 'X-Playground-Identity': 'test-session-id' } }.
- For testing loading spinners, append ?_delay=1500.
- For testing error boundaries, append ?_status=500.
```
