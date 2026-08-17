import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Introduction & Getting Started Guide',
  description: 'Learn how Playground API gives your frontend real, persistent CRUD mutations without setting up a backend or database.',
};

export default function IntroductionPage() {
  const reactQueryCode = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '${config.publicApiUrl}';

// 1. Fetch Posts List (Merges seed baseline with your private session records)
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(\`\${API_BASE}/posts?_limit=10\`, { credentials: 'include' });
      return res.json();
    },
  });
}

// 2. Create a Post (Persists in your sandbox overlay!)
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
      // Invalidate query to see your newly created post at the top!
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}`;

  const axiosCode = `import axios from 'axios';

// Create configured Axios instance
export const api = axios.create({
  baseURL: '${config.publicApiUrl}',
  withCredentials: true, // Automatically manages session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Simulate Slow 3G network or 500 error boundaries for testing
export const fetchSlowPosts = () => {
  return api.get('/posts?_limit=5', {
    headers: { 'X-Simulate-Delay': '2000' }, // 2 second delay for skeleton loaders
  });
};`;

  const playwrightCode = `import { test, expect } from '@playwright/test';

test('E2E: Create and verify persisted post in isolated test sandbox', async ({ page, request }) => {
  const testSessionId = 'e2e-suite-' + Date.now();

  // 1. Create a post using direct API request with custom identity header
  const postRes = await request.post('${config.publicApiUrl}/posts', {
    headers: { 'X-Playground-Identity': testSessionId },
    data: { title: 'Playwright Automated Post', body: 'Testing CI/CD integration', user_id: 1 },
  });
  expect(postRes.status()).toBe(201);
  const created = await postRes.json();

  // 2. Query posts list with the same session header -> item is persisted at the top!
  const listRes = await request.get('${config.publicApiUrl}/posts', {
    headers: { 'X-Playground-Identity': testSessionId },
  });
  const list = await listRes.json();
  expect(list.data[0].id).toBe(created.id);
});`;

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* 1. Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
          Developer Quickstart & Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          The Mock API That Actually Remembers Your Data
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Playground API is an instant mock REST & GraphQL backend built for developers. Perform real <code className="font-mono text-accent-primary">POST</code>, <code className="font-mono text-accent-primary">PUT</code>, and <code className="font-mono text-accent-primary">DELETE</code> mutations that actually persist in your private session sandbox without altering shared global seed data.
        </p>
      </div>

      {/* 2. Base URL Box */}
      <div id="base-api-endpoint" className="p-5 sm:p-6 rounded-2xl glass-panel border border-accent-primary/30 bg-accent-light/10 space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-primary flex items-center gap-2">
            <Icon icon="ph:globe-bold" className="w-4 h-4" />
            Base API Endpoint (v1)
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold">No API Key Required</span>
        </div>
        <div className="p-3.5 rounded-xl bg-code-bg font-mono text-xs sm:text-sm font-bold text-emerald-400 select-all border border-border-theme">
          {config.publicApiUrl}
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Point your React, Vue, Next.js, or mobile app directly at this URL. No signup, credit card, or configuration required.
        </p>
      </div>

      {/* 3. The 3-Step Mental Model */}
      <div id="how-it-works" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-black text-text-primary">How State Persistence Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm">
              1
            </div>
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Global Seed Baseline</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Every visitor starts with 100 posts, 300 comments, 25 users, and 125 todos pre-loaded. This baseline dataset is strictly read-only.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="w-8 h-8 rounded-xl bg-accent-light text-accent-primary flex items-center justify-center font-bold font-mono text-sm">
              2
            </div>
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Your Private Session Overlay</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              When you send a <code className="font-mono text-accent-primary">POST</code> or <code className="font-mono text-accent-primary">DELETE</code>, changes are saved only to your private identity cookie or header.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center font-bold font-mono text-sm">
              3
            </div>
            <h3 className="font-bold text-text-primary text-sm sm:text-base">Real Virtual State View</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Subsequent list queries return your created items at the top. When you reset or test on another device, you get a clean slate anytime.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Comparison Table (JSONPlaceholder vs Playground API) */}
      <div id="comparison" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4 scroll-mt-20">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:scales-bold" className="w-5 h-5 text-accent-primary" />
          Why Developers Choose Playground API
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-bg-tertiary text-text-primary font-bold border-b border-border-theme">
                <th className="p-3.5">Feature</th>
                <th className="p-3.5 text-rose-400">JSONPlaceholder / DummyJSON</th>
                <th className="p-3.5 text-emerald-400">Playground API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              <tr>
                <td className="p-3.5 font-bold text-text-primary">POST / PUT / DELETE State</td>
                <td className="p-3.5 text-rose-400 font-medium">❌ Disappears on next fetch</td>
                <td className="p-3.5 text-emerald-400 font-bold">✅ Persists in your session sandbox</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Dynamic Custom Schemas</td>
                <td className="p-3.5 text-rose-400 font-medium">❌ Fixed endpoints only</td>
                <td className="p-3.5 text-emerald-400 font-bold">✅ POST any JSON to /custom/:collection</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Network Delay & Error Simulation</td>
                <td className="p-3.5 text-rose-400 font-medium">❌ Not customizable</td>
                <td className="p-3.5 text-emerald-400 font-bold">✅ ?_delay=2000 & ?_status=500</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-text-primary">JWT Auth Simulation</td>
                <td className="p-3.5 text-rose-400 font-medium">❌ Dummy tokens only</td>
                <td className="p-3.5 text-emerald-400 font-bold">✅ Login, refresh, and /auth/me</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-text-primary">GraphQL Sandbox Gateway</td>
                <td className="p-3.5 text-rose-400 font-medium">❌ REST only</td>
                <td className="p-3.5 text-emerald-400 font-bold">✅ Full GraphQL schema & mutations</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-text-primary">Snapshot Export / Import</td>
                <td className="p-3.5 text-rose-400 font-medium">❌ No state sharing</td>
                <td className="p-3.5 text-emerald-400 font-bold">✅ Share sandbox JSON with teammates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Framework Quickstart Recipes */}
      <div id="framework-recipes" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-black text-text-primary">
          Framework Quickstart Recipes
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Copy-paste ready code examples for modern frontend stacks:
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-text-primary">
              <Icon icon="simple-icons:react" className="w-4 h-4 text-cyan-400" />
              <span>React with TanStack Query (Stateful CRUD Demo)</span>
            </div>
            <CodeBlock code={reactQueryCode} language="typescript" title="usePosts.ts" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-text-primary">
              <Icon icon="simple-icons:axios" className="w-4 h-4 text-purple-400" />
              <span>Axios HTTP Client with Delay Simulation</span>
            </div>
            <CodeBlock code={axiosCode} language="typescript" title="apiClient.ts" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-text-primary">
              <Icon icon="simple-icons:playwright" className="w-4 h-4 text-emerald-400" />
              <span>Playwright Automated E2E Testing Suite</span>
            </div>
            <CodeBlock code={playwrightCode} language="typescript" title="posts.spec.ts" />
          </div>
        </div>
      </div>

      {/* 6. Platform Superpowers Directory */}
      <div id="superpowers" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-black text-text-primary">Platform Superpowers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/docs/auth"
            className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Icon icon="ph:lock-key-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              JWT Auth Simulation
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Test login, registration, token refresh, and protected <code className="font-mono">/auth/me</code> endpoints.
            </p>
          </Link>

          <Link
            href="/docs/custom"
            className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-primary flex items-center justify-center">
              <Icon icon="ph:circles-three-plus-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              Custom Dynamic Schemas
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Create arbitrary collections like <code className="font-mono">/custom/products</code> or seed domain templates in 1 click.
            </p>
          </Link>

          <Link
            href="/docs/avatars"
            className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <Icon icon="ph:user-circle-gear-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              SVG Avatar & Thumbnail Helper
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Generate crisp gradient avatar vectors and placeholder thumbnails on demand.
            </p>
          </Link>

          <Link
            href="/docs/graphql"
            className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Icon icon="simple-icons:graphql" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              GraphQL API Gateway
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Query and mutate your sandbox state using GraphQL schemas and GraphiQL IDE.
            </p>
          </Link>

          <Link
            href="/docs/export-import"
            className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Icon icon="ph:cloud-arrow-up-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              Snapshot Export & Import
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Download your sandbox state into a portable JSON snapshot and share it with your team.
            </p>
          </Link>

          <Link
            href="/docs/showcase"
            className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Icon icon="ph:rocket-launch-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              Live React Demo App
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Explore the full interactive E-Commerce store built entirely with Playground API.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
