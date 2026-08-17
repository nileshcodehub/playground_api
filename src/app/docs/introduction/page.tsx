import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export const metadata = {
  title: 'Introduction & Overview',
  description: 'Welcome to Playground API — the free, instant mock REST & GraphQL API with isolated per-user state persistence.',
};

export default function IntroductionPage() {
  return (
    <div className="space-y-12 w-full max-w-none">
      {/* 1. Executive Header */}
      <div id="overview" className="space-y-4 border-b border-border-theme/60 pb-8 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent-primary text-xs font-bold font-mono">
          <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
          <span>Documentation Overview</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
          Welcome to Playground API
        </h1>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
          Playground API is an instant mock REST & GraphQL backend service designed for frontend developers, mobile engineers, QA test suites, and AI model agents who need real, persistent CRUD mutations without managing backends or databases.
        </p>
      </div>

      {/* 2. Base API Endpoint */}
      <div id="base-api-endpoint" className="p-8 rounded-3xl bg-bg-secondary/40 border border-accent-primary/30 shadow-sm space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-primary flex items-center gap-2">
            <Icon icon="ph:globe-bold" className="w-4 h-4" />
            Base API Endpoint (v1)
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold">No API Key Required</span>
        </div>
        <div className="p-4 rounded-2xl bg-code-bg font-mono text-sm sm:text-base font-bold text-emerald-400 select-all border border-border-theme">
          {config.publicApiUrl}
        </div>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          All endpoints are scoped under version 1 (<code className="font-mono text-accent-primary">/api/v1/...</code>) guaranteeing long-term backwards compatibility.
        </p>
      </div>

      {/* 3. Core Pillars */}
      <div id="core-pillars" className="space-y-6 scroll-mt-20">
        <h2 className="text-2xl font-bold text-text-primary">What Makes Playground API Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-theme space-y-2.5">
            <div className="flex items-center gap-2.5 text-text-primary font-bold text-base">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5 text-emerald-400" />
              <span>Real Stateful CRUD Persistence</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              When you create a post or update a user profile, the change persists in your private session overlay. Refresh the page or fetch the list — your item remains there.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-theme space-y-2.5">
            <div className="flex items-center gap-2.5 text-text-primary font-bold text-base">
              <Icon icon="ph:users-three-bold" className="w-5 h-5 text-indigo-400" />
              <span>Zero Collision Isolation</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Global baseline seed data is read-only. Your mutations never affect other developers, teammates, or visitors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-theme space-y-2.5">
            <div className="flex items-center gap-2.5 text-text-primary font-bold text-base">
              <Icon icon="ph:timer-bold" className="w-5 h-5 text-purple-400" />
              <span>Network & Chaos Simulation</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Test loading skeletons and error boundaries effortlessly by appending <code className="font-mono">?_delay=1500</code> or <code className="font-mono">?_status=500</code> to any endpoint.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-theme space-y-2.5">
            <div className="flex items-center gap-2.5 text-text-primary font-bold text-base">
              <Icon icon="ph:lock-key-bold" className="w-5 h-5 text-amber-400" />
              <span>JWT Authentication Simulation</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Simulate full auth loops with <code className="font-mono">/auth/login</code>, <code className="font-mono">/auth/refresh</code>, and Bearer-protected <code className="font-mono">/auth/me</code> endpoints.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Quick Nav Pathway Cards */}
      <div id="get-started-paths" className="space-y-4 pt-4 border-t border-border-theme/60 scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">Where Would You Like to Start?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/docs/quickstart"
            className="p-6 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Icon icon="ph:lightning-fill" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors text-sm sm:text-base">
              30-Second Quickstart
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Learn the 3-step workflow to fetch, mutate, and verify state persistence in 30 seconds.
            </p>
          </Link>

          <Link
            href="/docs/how-it-works"
            className="p-6 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-primary flex items-center justify-center">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors text-sm sm:text-base">
              How Sandboxing Works
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Understand session isolation, overlay merging rules, and the 10-day retention policy.
            </p>
          </Link>

          <Link
            href="/docs/recipes"
            className="p-6 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Icon icon="ph:code-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-accent-primary transition-colors text-sm sm:text-base">
              Framework Recipes
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Copy-paste integration snippets for React Query, Axios, Next.js, and Playwright.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
