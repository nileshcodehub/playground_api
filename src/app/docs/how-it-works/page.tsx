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
  const headerSample = `// Cross-Origin / Mobile / E2E Header Identification
fetch('${config.publicApiUrl}/posts', {
  headers: {
    'X-Playground-Identity': '<your_session_token_or_e2e_id>',
  },
});`;

  return (
    <div className="space-y-12 w-full max-w-none">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 border-b border-border-theme/60 pb-8 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent-primary text-xs font-bold font-mono">
          <Icon icon="ph:shield-check-bold" className="w-3.5 h-3.5" />
          <span>Session Sandboxing Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          How State Isolation & Sandboxing Works
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
          Learn how Playground API gives every visitor their own private mutation layer while keeping global seed data clean and unmodified.
        </p>
      </div>

      {/* 2. Visual Architecture Diagram */}
      <div id="architecture-model" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:layers-bold" className="w-5 h-5 text-accent-primary" />
          The Overlay Merging Engine
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Instead of copying an entire database for every user, Playground API uses a lightweight <strong>read-time overlay merging engine</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-bg-secondary border border-border-theme space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Layer 1: Global Seed</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              Read-only baseline database containing 100 posts, 25 users, 300 comments, and 125 todos. Shared by all visitors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-bg-secondary border border-border-theme space-y-2">
            <span className="text-xs font-mono font-bold text-accent-primary uppercase">Layer 2: Private Overlay</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your POST creates, PUT/PATCH updates, and DELETE removals are recorded in an isolated virtual overlay table linked to your session.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-bg-secondary border border-border-theme space-y-2">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase">Layer 3: Merged Output</span>
            <p className="text-xs text-text-secondary leading-relaxed">
              When you query <code className="font-mono">GET /posts</code>, the engine merges your private overlay onto the global baseline on the fly.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Session Identification (Cookies & Headers) */}
      <div id="session-identification" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:cookie-bold" className="w-5 h-5 text-amber-400" />
          Session Identification (Cookies & Headers)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Session tracking works automatically out of the box using HTTP cookies. For mobile apps, Playwright tests, or cross-origin scenarios where cookies might be blocked, you can pass the identity header explicitly:
        </p>
        <CodeBlock code={headerSample} language="javascript" title="customHeader.js" />
      </div>

      {/* 4. Quotas & Retention Policy */}
      <div id="retention" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:clock-countdown-bold" className="w-5 h-5 text-purple-400" />
          Quotas & 10-Day Retention Policy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-text-secondary">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-1">
            <strong className="text-text-primary block">30 Created Records Per Collection</strong>
            <p className="leading-relaxed">Each session can create up to 30 custom items per resource (e.g. 30 custom posts, 30 custom users).</p>
          </div>
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-1">
            <strong className="text-text-primary block">10-Day Inactivity Retention</strong>
            <p className="leading-relaxed">Sessions remain active for 10 days from your last request before being cleaned up by background crons.</p>
          </div>
        </div>
      </div>

      {/* 5. Reset Anytime */}
      <div id="reset-state" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:trash-bold" className="w-5 h-5 text-rose-400" />
          Resetting Your Sandbox to a Clean Slate
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Want to start fresh or run automated tests against pristine baseline data? Issue a single <code className="font-mono text-rose-400">DELETE /api/v1/session/reset</code> request to purge all session mutations instantly.
        </p>
      </div>

      {/* 6. Navigation Footer */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/docs/quickstart"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary" />
          <span>Prev: 30s Quickstart</span>
        </Link>
        <Link
          href="/docs/recipes"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all ml-auto"
        >
          <span>Next: Framework Recipes</span>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
