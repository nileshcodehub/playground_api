import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'How Sandboxing Works',
  description: 'Understand the architecture behind Playground API: isolated per-user session overlays, HMAC signatures, and stateful mutations.',
};

export default function HowItWorksPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1';

  const headerSample = `// Header Identification for Mobile / CI Test Runs
fetch('${publicApiUrl}/posts', {
  headers: {
    'X-Playground-Identity': 'test-run-session-id',
  },
});`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          How Sandboxing Works
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Learn how Playground API isolates mutations to your private session while preserving pristine baseline data for all users.
        </p>
      </div>

      {/* 2. Architecture */}
      <div id="overlay-engine" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          The Overlay Merging Engine
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Playground API utilizes a read-time virtual overlay engine:
        </p>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
          <li><strong>Layer 1 (Baseline Seed):</strong> Read-only global dataset shared by all users.</li>
          <li><strong>Layer 2 (Private Overlay):</strong> Your POST creates, PUT updates, and DELETE removals stored against your session ID.</li>
          <li><strong>Layer 3 (Merged Output):</strong> When you call <code className="font-mono text-accent-primary">GET /posts</code>, the server overlays your changes onto the seed data dynamically.</li>
        </ul>
      </div>

      {/* 3. Session Identification */}
      <div id="session-identification" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Session Identification (Cookies & Headers)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Sessions are automatically managed via HTTP cookies. For automated Playwright test suites or mobile apps where cookies may be restricted, you can pass the identity header:
        </p>
        <CodeBlock code={headerSample} language="javascript" title="headerAuth.js" />
      </div>

      {/* 4. Reset Anytime */}
      <div id="reset-sandbox" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Resetting Sandbox to Baseline State
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          To wipe your mutations and restore pristine baseline data, send a single <code className="font-mono text-rose-400">DELETE /api/v1/session/reset</code> request.
        </p>
      </div>

      {/* 5. Bottom Navigation */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        <Link
          href="/docs/quickstart"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
            <span>30s Quickstart</span>
          </div>
        </Link>

        <Link
          href="/docs/recipes"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
        >
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
            <span>Framework Recipes</span>
          </div>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
