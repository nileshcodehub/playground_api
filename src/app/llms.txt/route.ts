import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const publicApi = config.publicApiUrl || config.apiUrl;
  const content = `# Playground API — AI Model Documentation & Overview

> Free, Instant, Sandboxed Mock REST & GraphQL API Service for Web & Mobile Development.
> Base API URL: ${publicApi}
> OpenAPI Spec: ${publicApi}/downloads/openapi.json
> Postman Collection: ${publicApi}/downloads/postman.json
> TypeScript SDK: ${publicApi}/downloads/playground-api.d.ts

## Project Overview
Playground API is a modern JSONPlaceholder & Platzi Fake API replacement engineered with identity-isolated mutation overlays over global seed datasets. Frontend applications can perform real POST, PUT, PATCH, and DELETE operations without requiring database setup or backend code.

## Key Features for AI Developers & Agents
1. **Sandboxed Overlay State**: User mutations (creates, updates, deletes) are isolated per visitor using signed tokens (\`pg_identity\` cookie or \`X-Playground-Identity\` header).
2. **Global Seed Dataset**: Shared read-only base data for Posts (100 items), Comments (500 items), Users (10 items), Todos (200 items).
3. **REST & GraphQL Gateway**: Complete REST endpoints under \`/api/v1\` plus a GraphQL Gateway at \`/api/v1/graphql\`.
4. **JWT Authentication Simulation**: POST \`/auth/login\` and GET \`/auth/me\` for prototyping auth flows.
5. **Dynamic Custom Resources**: Arbitrary collection paths like \`/custom/products\` or \`/custom/orders\`.
6. **Network Simulation Headers**: Support for \`X-Simulate-Delay: 1000\` and \`X-Simulate-Status: 500\` middleware testing.

## Core API Endpoints Reference
- GET ${publicApi}/posts (List posts, supports ?page=1&limit=10&q=search&_sort=title&_order=desc)
- GET ${publicApi}/posts/:id (Get post by ID or local sandbox ID)
- POST ${publicApi}/posts (Create new post overlay)
- PUT ${publicApi}/posts/:id (Replace post overlay)
- PATCH ${publicApi}/posts/:id (Partial post overlay update)
- DELETE ${publicApi}/posts/:id (Delete post overlay)
- GET ${publicApi}/users (List users)
- GET ${publicApi}/users/:id/posts (Relational user posts)
- POST ${publicApi}/auth/login (Fake JWT login)
- GET ${publicApi}/auth/me (Get profile via Bearer token)
- POST ${publicApi}/graphql (GraphQL query & mutation gateway)

## How to Integrate in Real-World Projects
\`\`\`javascript
// Fetch posts using standard JavaScript fetch
const response = await fetch('${publicApi}/posts?_limit=5');
const posts = await response.json();
console.log('Fetched posts:', posts);
\`\`\`

Full specification available at: ${config.siteUrl}/llms-full.txt
`;


  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
