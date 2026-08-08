import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export const metadata = {
  title: 'Introduction & Architecture Overview',
  description: 'Comprehensive guide to Playground API — architecture details, base URL /api/v1, identity sandbox overlays, and implementation guide.',
};

export default function IntroductionPage() {
  return (
    <div className="space-y-10 w-full max-w-none">
      {/* Title Header */}
      <div className="space-y-3 border-b border-border-theme pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
          Overview & Architecture Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Welcome to Playground API
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Playground API is an open-source, instant mock REST & GraphQL API service built for developers, frontend engineers, QA suites, and AI model agents who need realistic data without managing backends or databases.
        </p>
      </div>

      {/* Why Playground API Was Built */}
      <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:rocket-launch-bold" className="w-5 h-5 text-accent-primary" />
          Why Playground API?
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Traditional mock APIs like JSONPlaceholder echo dummy responses on POST/PUT/DELETE requests but do not persist changes. When you refresh your frontend app or fetch a list, created items disappear.
        </p>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          <strong>Playground API solves this completely.</strong> Using per-session virtual overlays, your mutations (creates, edits, deletes) persist across requests for your session identity while global seed datasets remain read-only for all other visitors.
        </p>
      </div>

      {/* Base API v1 URL Section */}
      <div className="p-6 rounded-2xl glass-panel border border-accent-primary/30 bg-accent-light/10 space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-accent-primary flex items-center gap-2">
          <Icon icon="ph:globe-bold" className="w-5 h-5" />
          Base API v1 Endpoint
        </h2>
        <div className="p-3.5 rounded-xl bg-code-bg font-mono text-xs sm:text-sm font-bold text-emerald-400 select-all border border-border-theme">
          {config.apiUrl}
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          All endpoints are scoped under version 1 (<code className="font-mono text-accent-primary">/api/v1/...</code>). This guarantees future updates (e.g. <code className="font-mono text-text-muted">/api/v2/</code>) will maintain full backwards compatibility for your applications.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">Core Architectural Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm sm:text-base">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5 text-emerald-500" />
              1. HMAC Signed Identity Tokens
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sessions are authenticated via signed <code className="font-mono text-accent-primary">pg_identity</code> cookies or <code className="font-mono text-accent-primary">X-Playground-Identity</code> headers. Forged tokens automatically fall back to IP auto-recovery.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm sm:text-base">
              <Icon icon="ph:layers-bold" className="w-5 h-5 text-indigo-500" />
              2. Read-Time Overlay Merging
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Global tables (<code className="font-mono text-text-muted">posts_global</code>, etc.) are read-only. Your mutations are stored in <code className="font-mono text-accent-primary">overlay_records</code> and merged into virtual lists at query time.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm sm:text-base">
              <Icon icon="simple-icons:graphql" className="w-5 h-5 text-pink-500" />
              3. REST & GraphQL Parity
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Whether you fetch via REST endpoints (<code className="font-mono text-accent-primary">/api/v1/posts</code>) or GraphQL (<code className="font-mono text-accent-primary">/api/v1/graphql</code>), both share the exact same overlay engine.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border-theme bg-bg-secondary space-y-2">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm sm:text-base">
              <Icon icon="ph:clock-afternoon-bold" className="w-5 h-5 text-amber-500" />
              4. Middleware Network Simulation
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Header flags like <code className="font-mono text-accent-primary">X-Simulate-Delay: 2000</code> and <code className="font-mono text-accent-primary">X-Simulate-Status: 500</code> let you test UI loading spinners and error handling cleanly.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Integration Guide */}
      <div className="space-y-4 pt-4 border-t border-border-theme">
        <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">Step-by-Step Implementation Guide</h2>
        <ol className="space-y-3 text-sm text-text-secondary list-decimal pl-5 leading-relaxed">
          <li><strong>Target base URL:</strong> Configure your frontend HTTP client (Fetch, Axios, TanStack Query) to use <code className="font-mono text-accent-primary">{config.apiUrl}</code>.</li>
          <li><strong>Perform standard CRUD operations:</strong> Issue GET, POST, PUT, PATCH, DELETE requests against resource endpoints.</li>
          <li><strong>Inspect identity token:</strong> Check the <code className="font-mono text-accent-primary">Sandbox Active</code> pill in the site header to copy or reset your session identity token.</li>
          <li><strong>Download workspace collections:</strong> Import OpenAPI or Postman collections into your API client for team testing.</li>
        </ol>
      </div>

      {/* Quick Links */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/docs/posts"
          className="p-4 rounded-xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all text-xs sm:text-sm font-semibold text-text-primary flex items-center justify-between group"
        >
          <span>Explore REST Collections</span>
          <Icon icon="ph:caret-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/docs/studio"
          className="p-4 rounded-xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all text-xs sm:text-sm font-semibold text-text-primary flex items-center justify-between group"
        >
          <span>Interactive API Studio</span>
          <Icon icon="ph:caret-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/docs/export-import"
          className="p-4 rounded-xl border border-border-theme bg-bg-secondary hover:border-accent-primary/50 transition-all text-xs sm:text-sm font-semibold text-text-primary flex items-center justify-between group"
        >
          <span>Snapshot Export & Import</span>
          <Icon icon="ph:caret-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
