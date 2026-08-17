import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Framework Integration Recipes',
  description: 'Copy-paste integration recipes for React, TanStack Query, Axios, Next.js 15, and Playwright.',
};

export default function RecipesPage() {
  const reactQuerySnippet = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '${config.publicApiUrl}';

// 1. Fetch Posts List with search and pagination
export function usePosts({ page = 1, query = '' } = {}) {
  return useQuery({
    queryKey: ['posts', { page, query }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (query) params.append('q', query);
      const res = await fetch(\`\${API_BASE}/posts?\${params.toString()}\`, {
        credentials: 'include',
      });
      return res.json();
    },
  });
}

// 2. Create Post Mutation (Persists in sandbox!)
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost: { title: string; body: string; user_id: number }) => {
      const res = await fetch(\`\${API_BASE}/posts\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate to display newly created post at the top
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}`;

  const axiosSnippet = `import axios from 'axios';

// 1. Create configured Axios client
export const api = axios.create({
  baseURL: '${config.publicApiUrl}',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add auth interceptor for Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pg_access_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// 3. Helper for testing slow 3G network latency
export const fetchSlowPosts = () => {
  return api.get('/posts?_limit=5', {
    headers: { 'X-Simulate-Delay': '1500' },
  });
};`;

  const playwrightSnippet = `import { test, expect } from '@playwright/test';

test('Isolated sandbox CRUD lifecycle in CI/CD pipeline', async ({ request }) => {
  // Use a unique session ID for complete test run isolation
  const sessionId = 'test-suite-' + Date.now();
  const headers = { 'X-Playground-Identity': sessionId };

  // 1. Create a custom post
  const createRes = await request.post('${config.publicApiUrl}/posts', {
    headers,
    data: { title: 'Playwright Post', body: 'Automated test post', user_id: 1 },
  });
  expect(createRes.status()).toBe(201);
  const created = await createRes.json();

  // 2. Verify it is persisted at top of list
  const listRes = await request.get('${config.publicApiUrl}/posts', { headers });
  const list = await listRes.json();
  expect(list.data[0].id).toBe(created.id);

  // 3. Reset sandbox clean
  const resetRes = await request.delete('${config.publicApiUrl}/session/reset', { headers });
  expect(resetRes.status()).toBe(200);
});`;

  return (
    <div className="space-y-12 w-full max-w-none">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 border-b border-border-theme/60 pb-8 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold font-mono">
          <Icon icon="ph:code-bold" className="w-3.5 h-3.5" />
          <span>Integration Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Framework Integration Recipes
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
          Production-ready code snippets and architecture patterns for popular frontend libraries, state managers, and test suites.
        </p>
      </div>

      {/* 2. React + TanStack Query */}
      <div id="react-query" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
          <Icon icon="simple-icons:react" className="w-5 h-5 text-cyan-400" />
          <h2>React with TanStack Query (Stateful CRUD Hooks)</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Demonstrates how to fetch list data and invalidate queries on mutations so your created posts immediately render without manual array splicing.
        </p>
        <CodeBlock code={reactQuerySnippet} language="typescript" title="src/hooks/usePosts.ts" />
      </div>

      {/* 3. Axios Client */}
      <div id="axios" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
          <Icon icon="simple-icons:axios" className="w-5 h-5 text-purple-400" />
          <h2>Axios Client with JWT Interceptors & Latency Headers</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Configured Axios instance with Bearer token injection and helper functions for testing loading spinners.
        </p>
        <CodeBlock code={axiosSnippet} language="typescript" title="src/lib/api.ts" />
      </div>

      {/* 4. Playwright E2E */}
      <div id="playwright" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <div className="flex items-center gap-2 text-text-primary font-bold text-lg">
          <Icon icon="simple-icons:playwright" className="w-5 h-5 text-emerald-400" />
          <h2>Playwright Automated Integration & E2E Testing</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Run automated tests in parallel without database locks or race conditions by passing unique session identity headers.
        </p>
        <CodeBlock code={playwrightSnippet} language="typescript" title="e2e/posts.spec.ts" />
      </div>

      {/* 5. Navigation Footer */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/docs/how-it-works"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary" />
          <span>Prev: How Sandboxing Works</span>
        </Link>
        <Link
          href="/docs/studio"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all ml-auto"
        >
          <span>Next: Interactive Studio</span>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
