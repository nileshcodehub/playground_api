'use client';

import React from 'react';
import { Icon } from '@iconify/react';

const features = [
  {
    icon: 'ph:shield-check-bold',
    title: 'Complete CRUD with State Persistence',
    description: 'Perform real POST, PUT, PATCH, and DELETE operations. Your mutations persist across page refreshes in your private session overlay.',
    borderColor: 'hover:border-emerald-500/60',
    iconColor: 'text-emerald-400 bg-emerald-500/15',
  },
  {
    icon: 'ph:timer-bold',
    title: 'Network Delay & Error Simulation',
    description: 'Simulate slow 3G networks or 500 error boundaries on demand with simple headers like X-Simulate-Delay: 1500 or ?_status=500.',
    borderColor: 'hover:border-purple-500/60',
    iconColor: 'text-purple-400 bg-purple-500/15',
  },
  {
    icon: 'ph:lock-key-bold',
    title: 'JWT Authentication Simulation',
    description: 'Simulate full authentication loops with /auth/login, /auth/refresh, and protected Bearer token profile endpoints.',
    borderColor: 'hover:border-amber-500/60',
    iconColor: 'text-amber-400 bg-amber-500/15',
  },
  {
    icon: 'ph:circles-three-plus-bold',
    title: 'Dynamic Custom Collections',
    description: 'Create arbitrary collections on the fly like /custom/products or /custom/orders without touching backend code or database schemas.',
    borderColor: 'hover:border-pink-500/60',
    iconColor: 'text-pink-400 bg-pink-500/15',
  },
  {
    icon: 'simple-icons:graphql',
    title: 'Unified REST & GraphQL Gateway',
    description: 'Query standard REST endpoints under /api/v1 or execute GraphQL queries and mutations against /api/v1/graphql with GraphiQL IDE.',
    borderColor: 'hover:border-cyan-500/60',
    iconColor: 'text-cyan-400 bg-cyan-500/15',
  },
  {
    icon: 'ph:cloud-arrow-up-bold',
    title: 'Snapshot Export & Import',
    description: 'Export your entire sandboxed mock database as a JSON file to share with teammates or load into automated Playwright test runs.',
    borderColor: 'hover:border-indigo-500/60',
    iconColor: 'text-indigo-400 bg-indigo-500/15',
  },
  {
    icon: 'ph:user-circle-gear-bold',
    title: 'Deterministic SVG Avatar Generator',
    description: 'Generate crisp vector SVG user avatars and landscape thumbnail placeholders dynamically with /api/v1/avatars/:seed.',
    borderColor: 'hover:border-rose-500/60',
    iconColor: 'text-rose-400 bg-rose-500/15',
  },
  {
    icon: 'ph:magnifying-glass-bold',
    title: 'Universal Full-Text Search',
    description: 'Filter dataset records instantly across titles and bodies using the full-text search parameter ?q=keyword.',
    borderColor: 'hover:border-yellow-500/60',
    iconColor: 'text-yellow-400 bg-yellow-500/15',
  },
  {
    icon: 'ph:download-simple-bold',
    title: 'Postman, Bruno & OpenAPI 3.0 Specs',
    description: 'Download ready-to-use workspace collections for Postman, Bruno, Insomnia, Swagger OpenAPI, and TypeScript .d.ts definitions.',
    borderColor: 'hover:border-teal-500/60',
    iconColor: 'text-teal-400 bg-teal-500/15',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 bg-bg-secondary border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold font-mono">
            <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
            <span>Developer Superpowers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Engineered for Real-World Prototyping
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Everything frontend developers, QA suites, and AI model agents need to prototype, test, and ship applications without managing servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`p-7 rounded-3xl glass-panel border border-border-theme/70 ${feat.borderColor} transition-all space-y-4 shadow-sm group`}
            >
              <div className={`w-12 h-12 rounded-2xl ${feat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                <Icon icon={feat.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
