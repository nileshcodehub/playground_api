import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: '30-Second Quickstart',
  description: 'Get started with Playground API in 3 easy steps — send a request, mutate data, and see it persist in your private sandbox.',
};

export default function QuickstartPage() {
  const getSample = `// Step 1: Fetch baseline posts
const res = await fetch('${config.publicApiUrl}/posts?_limit=5', {
  credentials: 'include',
});
const { data, pagination } = await res.json();
console.log('Posts:', data);`;

  const postSample = `// Step 2: Create a post in your isolated sandbox
const res = await fetch('${config.publicApiUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Automatically passes your session cookie
  body: JSON.stringify({
    title: 'Hello from my React app!',
    body: 'This post is persisted in my private sandbox overlay.',
    user_id: 1,
  }),
});

const createdPost = await res.json();
console.log('Created ID:', createdPost.id); // e.g. "local-a1b2c3d4-..."`;

  const fetchUpdatedSample = `// Step 3: Fetch posts again — your new post is right at the top!
const res = await fetch('${config.publicApiUrl}/posts?_limit=5', {
  credentials: 'include',
});
const { data } = await res.json();
console.log('Top Post:', data[0].title); // "Hello from my React app!"`;

  return (
    <div className="space-y-12 w-full max-w-none">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 border-b border-border-theme/60 pb-8 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold font-mono">
          <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
          <span>30-Second Quickstart</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Start Prototyping in 3 Simple Steps
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
          Follow this 30-second guide to see how Playground API allows real CRUD mutations to persist in your frontend application without any backend setup.
        </p>
      </div>

      {/* 2. Step 1 */}
      <div id="step-1" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-primary text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
            1
          </div>
          <h2 className="text-xl font-bold text-text-primary">Fetch Baseline Seed Data</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Send a standard <code className="font-mono text-accent-primary">GET</code> request. All endpoints support query filters like <code className="font-mono">?_limit=5</code>, <code className="font-mono">?_sort=title</code>, and full-text search with <code className="font-mono">?q=searchTerm</code>.
        </p>
        <CodeBlock code={getSample} language="javascript" title="fetchPosts.js" />
      </div>

      {/* 3. Step 2 */}
      <div id="step-2" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-primary text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
            2
          </div>
          <h2 className="text-xl font-bold text-text-primary">Create a New Record in Your Sandbox</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Send a <code className="font-mono text-accent-primary">POST</code> request. The backend assigns an isolated sandbox ID (<code className="font-mono">local-&lt;uuid&gt;</code>) and immediately saves it to your private session overlay.
        </p>
        <CodeBlock code={postSample} language="javascript" title="createPost.js" />
      </div>

      {/* 4. Step 3 */}
      <div id="step-3" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
            3
          </div>
          <h2 className="text-xl font-bold text-text-primary">Verify Real Stateful Persistence</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Call the list endpoint again. Unlike traditional mock APIs where created items vanish, your new item appears at the top of the list!
        </p>
        <CodeBlock code={fetchUpdatedSample} language="javascript" title="verifyPersistence.js" />
      </div>

      {/* 5. Next Step Action Cards */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/docs/recipes"
          className="p-6 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary group-hover:text-accent-primary transition-colors flex items-center gap-2">
              <Icon icon="ph:code-bold" className="w-5 h-5 text-accent-primary" />
              <span>Framework Recipes</span>
            </span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Copy-paste integrations for React Query, Axios interceptors, Next.js, and Playwright.
          </p>
        </Link>

        <Link
          href="/docs/studio"
          className="p-6 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary group-hover:text-accent-primary transition-colors flex items-center gap-2">
              <Icon icon="ph:play-circle-bold" className="w-5 h-5 text-emerald-400" />
              <span>Interactive API Studio</span>
            </span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Test endpoints live in the browser with network latency sliders and status overrides.
          </p>
        </Link>
      </div>
    </div>
  );
}
