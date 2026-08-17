import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Framework Recipes',
  description: 'Copy-paste integration recipes for React, TanStack Query, Axios, Next.js, and Playwright.',
};

export default function RecipesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1';

  const reactQuerySnippet = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '${publicApiUrl}';

// 1. Fetch Posts List with search
export function usePosts(query = '') {
  return useQuery({
    queryKey: ['posts', query],
    queryFn: async () => {
      const url = query ? \`\${API_BASE}/posts?q=\${query}\` : \`\${API_BASE}/posts\`;
      const res = await fetch(url, { credentials: 'include' });
      return res.json();
    },
  });
}

// 2. Create Post Mutation (Persists in sandbox!)
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost) => {
      const res = await fetch(\`\${API_BASE}/posts\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}`;

  const axiosSnippet = `import axios from 'axios';

// Configured Axios instance with auto-cookies and Bearer tokens
export const api = axios.create({
  baseURL: '${publicApiUrl}',
  withCredentials: true,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem('access_token');
  if (token) req.headers.Authorization = \`Bearer \${token}\`;
  return req;
});`;

  const playwrightSnippet = `import { test, expect } from '@playwright/test';

test('Isolated sandbox CRUD lifecycle in CI', async ({ request }) => {
  const headers = { 'X-Playground-Identity': 'test-' + Date.now() };

  // 1. Create a post
  const res = await request.post('${publicApiUrl}/posts', {
    headers,
    data: { title: 'CI Post', body: 'Testing persistence', user_id: 1 },
  });
  expect(res.status()).toBe(201);

  // 2. Verify in list
  const list = await (await request.get('${publicApiUrl}/posts', { headers })).json();
  expect(list.data[0].title).toBe('CI Post');

  // 3. Reset sandbox
  await request.delete('${publicApiUrl}/session/reset', { headers });
});`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Framework Recipes
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Production-ready code snippets and architecture patterns for popular frontend libraries and test runners.
        </p>
      </div>

      {/* 2. React Query */}
      <div id="react-query" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          React with TanStack Query
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Manage sandbox state queries and mutations with automatic cache invalidation.
        </p>
        <CodeBlock code={reactQuerySnippet} language="javascript" title="usePosts.js" />
      </div>

      {/* 3. Axios Client */}
      <div id="axios" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Axios Client with JWT Interceptors
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Configured client passing session cookies and Bearer tokens seamlessly.
        </p>
        <CodeBlock code={axiosSnippet} language="javascript" title="api.js" />
      </div>

      {/* 4. Playwright */}
      <div id="playwright" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Playwright Automated E2E Tests
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Execute parallel tests in complete isolation using custom session identity headers.
        </p>
        <CodeBlock code={playwrightSnippet} language="javascript" title="posts.spec.js" />
      </div>

      {/* 5. Bottom Navigation */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        <Link
          href="/docs/how-it-works"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
            <span>How Sandboxing Works</span>
          </div>
        </Link>

        <Link
          href="/docs/simulation"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
        >
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
            <span>Network Simulation</span>
          </div>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
