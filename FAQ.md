# Playground API — Frequently Asked Questions (FAQ)

### 1. How does state persistence work without requiring a login?
Playground API uses HMAC-signed session identity tokens (`pg_identity` cookie or `X-Playground-Identity` header). When you perform a `POST`, `PUT`, `PATCH`, or `DELETE` mutation, it is written to an isolated database overlay table linked to your unique session token. When you query a `GET` endpoint, the server merges your session mutations on top of the shared global seed dataset on the fly.

### 2. Can my mutations alter or corrupt data for other users?
**No.** Global seed datasets (100 posts, 25 users, 300 comments, 125 todos) are strictly read-only. Your mutations are stored in your private virtual sandbox overlay and are visible only to your session token.

### 3. How long is my sandbox session preserved?
Sessions are preserved for **10 days of inactivity**. Each time you send a request with your session token, the 10-day retention window resets. Inactive sessions are automatically cleaned up by background crons.

### 4. How can I reset my sandbox to the pristine baseline?
You can wipe all mutations anytime by sending a `DELETE /api/v1/session/reset` request or clicking the **"Reset Sandbox"** button in the documentation sidebar.

### 5. How do I use Playground API in Playwright or Cypress CI/CD tests?
Pass a unique header per test run:
```javascript
headers: {
  'X-Playground-Identity': 'test-run-' + Date.now(),
}
```
This guarantees 100% test isolation, allowing hundreds of tests to run in parallel without database locks or race conditions.

### 6. What is the maximum number of items I can create in a session?
Each session has a generous quota of up to **30 custom created items per collection** (e.g. 30 custom posts, 30 custom users, 30 custom products).

### 7. How do I simulate network delays or 500 server errors?
Append query parameters or HTTP headers to any request:
* **Latency Simulation:** `?_delay=1500` or header `X-Simulate-Delay: 1500`
* **Error Simulation:** `?_status=500` or header `X-Simulate-Status: 500`

### 8. Does Playground API support GraphQL?
**Yes.** Send standard GraphQL queries and mutations to `POST /api/v1/graphql` or open the interactive GraphiQL IDE in your browser at `/docs/graphql`.
