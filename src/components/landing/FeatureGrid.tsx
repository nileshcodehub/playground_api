import React from 'react';
import { Icon } from '@iconify/react';

const features = [
  {
    icon: 'ph:shield-check-bold',
    title: 'Per-User Sandbox State Overlays',
    description: 'Perform real POST, PUT, PATCH, and DELETE mutations. Your changes are isolated to your signed session token without altering shared seed datasets.',
  },
  {
    icon: 'simple-icons:graphql',
    title: 'REST & GraphQL Unified Gateway',
    description: 'Query REST endpoints under /api/v1 or execute GraphQL queries and mutations against /api/v1/graphql powered by overlayService.',
  },
  {
    icon: 'ph:lock-key-bold',
    title: 'Fake JWT Authentication Simulation',
    description: 'Simulate auth flows with POST /auth/login, POST /auth/refresh, and GET /auth/me using Bearer tokens.',
  },
  {
    icon: 'ph:circles-three-plus-bold',
    title: 'Dynamic Custom Collections',
    description: 'Create arbitrary collections on the fly like /api/v1/custom/products or /api/v1/custom/orders without backend code changes.',
  },
  {
    icon: 'ph:clock-afternoon-bold',
    title: 'Network Delay & Error Simulation',
    description: 'Test UI spinners and error boundaries with headers like X-Simulate-Delay: 1500 and X-Simulate-Status: 500.',
  },
  {
    icon: 'ph:user-circle-gear-bold',
    title: 'Built-in SVG Avatar Generator',
    description: 'Instantly generate deterministic SVG avatars for user profile placeholders via /api/v1/avatars/:seed.',
  },
  {
    icon: 'ph:magnifying-glass-bold',
    title: 'Universal Full-Text Search',
    description: 'Filter dataset records instantly across titles and bodies using the full-text search parameter ?q=keyword.',
  },
  {
    icon: 'ph:sort-ascending-bold',
    title: 'Dynamic Multi-Field Sorting',
    description: 'Sort virtual and global datasets dynamically with ?_sort=field&_order=asc|desc parameters.',
  },
  {
    icon: 'ph:tree-structure-bold',
    title: 'Relational Sub-Resource Queries',
    description: 'Fetch relational data smoothly using GET /posts?user_id=1, GET /users/1/posts, or GET /posts/1/comments.',
  },
  {
    icon: 'ph:download-simple-bold',
    title: 'One-Click Multi-Format Collections',
    description: 'Export complete workspace collections in OpenAPI 3.0, Postman v2.1, Bruno, Insomnia, and TypeScript .d.ts formats.',
  },
  {
    icon: 'ph:lightning-bold',
    title: 'Zero Setup & Zero Configuration',
    description: 'No database configuration, API key signup, or deployment step required. Instant availability for web & mobile apps.',
  },
  {
    icon: 'ph:cloud-arrow-up-bold',
    title: 'Session Snapshot Import & Export',
    description: 'Backup your entire sandboxed mock state as a JSON file or restore snapshots for E2E tests and team collaboration.',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 bg-bg-primary border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs font-bold">
            <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
            Full Feature Capabilities
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Engineered for Modern Web & Mobile Prototyping
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Everything developers and AI agents need to build, test, and prototype real-world applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="p-6 rounded-2xl glass-panel hover:border-accent-primary/50 transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light text-accent-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon icon={feat.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">{feat.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
