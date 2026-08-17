import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export const metadata = {
  title: 'Introduction & Key Features',
  description: 'Welcome to Playground API — Free Sandboxed Mock REST & GraphQL Service with isolated per-user state persistence.',
};

export default function IntroductionPage() {
  const keyFeatures = [
    {
      title: 'Complete CRUD Operations',
      desc: 'Create, read, update, and delete resources with persistent sandbox overlay state.',
    },
    {
      title: 'Standard REST API',
      desc: 'Standard RESTful endpoints for all resources (/posts, /comments, /users, /todos).',
    },
    {
      title: 'GraphQL Gateway Support',
      desc: 'Modern GraphQL schema and interactive GraphiQL IDE at /api/v1/graphql.',
    },
    {
      title: 'Built-in Pagination & Sorting',
      desc: 'Built-in ?_page=1&_limit=10 and ?_sort=title&_order=desc parameters for infinite scroll.',
    },
    {
      title: 'Fake JWT Authentication',
      desc: 'Secure token simulation with access and refresh tokens via /auth/login and /auth/me.',
    },
    {
      title: 'Network & Chaos Simulation',
      desc: 'Test UI loading skeletons (?_delay=1500) and error boundaries (?_status=500).',
    },
    {
      title: 'Dynamic Custom Collections',
      desc: 'Create arbitrary schema-less collections on the fly (/custom/products, /custom/orders).',
    },
    {
      title: 'Universal Full-Text Search',
      desc: 'Search keywords across titles and body contents using ?q=keyword.',
    },
    {
      title: 'Deterministic SVG Avatars',
      desc: 'Vector user avatars and thumbnail placeholders dynamically generated via /avatars/:seed.',
    },
    {
      title: 'Snapshot Export & Import',
      desc: 'Download sandbox state as a JSON file or restore snapshots for automated E2E tests.',
    },
    {
      title: 'Ready-to-Use Client Collections',
      desc: 'OpenAPI 3.0, Postman, Bruno, Insomnia, and TypeScript .d.ts downloads included.',
    },
  ];

  return (
    <div className="space-y-12 w-full max-w-none text-text-primary">
      {/* 1. Page Title */}
      <div id="overview" className="space-y-3 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Key Features
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API offers a comprehensive, zero-setup mock backend for web & mobile development:
        </p>
      </div>

      {/* 2. Base Endpoint Box */}
      <div className="p-5 rounded-2xl bg-bg-secondary dark:bg-code-bg border border-border-theme space-y-2">
        <div className="flex items-center justify-between text-xs text-text-muted font-semibold uppercase tracking-wider">
          <span>Base API URL (v1)</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">No API Key Required</span>
        </div>
        <div className="font-mono text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-bold select-all">
          {config.publicApiUrl}
        </div>
      </div>

      {/* 3. Checklist */}
      <div id="features" className="space-y-4 scroll-mt-20">
        <ul className="space-y-3 text-sm sm:text-base">
          {keyFeatures.map((item) => (
            <li key={item.title} className="flex items-start gap-3 text-text-secondary">
              <span className="text-emerald-600 dark:text-emerald-400 text-lg leading-none shrink-0 mt-0.5">✅</span>
              <div>
                <strong className="text-text-primary font-semibold">{item.title}</strong>
                <span className="text-text-secondary"> — {item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Bottom Next Card */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between">
        <div />
        <Link
          href="/docs/quickstart"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme transition-all group flex items-center gap-4 text-right"
        >
          <div>
            <span className="text-xs text-text-muted font-medium block">Next</span>
            <span className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors">
              30-Second Quickstart
            </span>
          </div>
          <Icon icon="ph:arrow-right-bold" className="w-5 h-5 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
