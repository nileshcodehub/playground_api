import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: '30-Second Quickstart',
  description: 'Get started with Playground API in 3 easy steps.',
};

export default function QuickstartPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1';

  const getSample = `// 1. Fetch baseline posts
const res = await fetch('${publicApiUrl}/posts?_limit=5', {
  credentials: 'include',
});
const { data } = await res.json();
console.log('Posts:', data);`;

  const postSample = `// 2. Create a post in your isolated sandbox
const res = await fetch('${publicApiUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'Hello from React!',
    body: 'This post persists in my private session.',
    user_id: 1,
  }),
});
const newPost = await res.json();
console.log('Created ID:', newPost.id);`;

  const fetchUpdatedSample = `// 3. Fetch again — your new post is right at the top
const res = await fetch('${publicApiUrl}/posts?_limit=5', {
  credentials: 'include',
});
const { data } = await res.json();
console.log('Top Post:', data[0].title);`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          30-Second Quickstart
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Follow these 3 simple steps to see how Playground API persists real CRUD mutations without backend setup.
        </p>
      </div>

      {/* 2. Step 1 */}
      <div id="step-1" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono flex items-center justify-center font-bold">1</span>
          <span>Fetch Baseline Seed Data</span>
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Send a standard <code className="font-mono text-accent-primary">GET</code> request to list posts. Supports <code className="font-mono">?_limit=5</code>, <code className="font-mono">?_sort=title</code>, and search <code className="font-mono">?q=term</code>.
        </p>
        <CodeBlock code={getSample} language="javascript" title="fetchPosts.js" />
      </div>

      {/* 3. Step 2 */}
      <div id="step-2" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono flex items-center justify-center font-bold">2</span>
          <span>Create a New Record in Your Sandbox</span>
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Send a <code className="font-mono text-accent-primary">POST</code> request. The server saves the record strictly to your private session overlay.
        </p>
        <CodeBlock code={postSample} language="javascript" title="createPost.js" />
      </div>

      {/* 4. Step 3 */}
      <div id="step-3" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono flex items-center justify-center font-bold">3</span>
          <span>Verify Real Persistence</span>
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Query the list endpoint again. Your newly created record is immediately returned at the top of the list!
        </p>
        <CodeBlock code={fetchUpdatedSample} language="javascript" title="verifyPersistence.js" />
      </div>

      {/* 5. Bottom Navigation */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        <Link
          href="/docs/introduction"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
            <span>Introduction</span>
          </div>
        </Link>

        <Link
          href="/docs/how-it-works"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
        >
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
            <span>How Sandboxing Works</span>
          </div>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
