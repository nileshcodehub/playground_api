import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export const metadata = {
  title: 'Playground API vs Alternatives',
  description: 'Objective feature and architectural comparison between Playground API, JSONPlaceholder, json-server, DummyJSON, and Mockoon.',
};

export default function ComparisonsPage() {
  const comparisonMatrix = [
    {
      feature: 'Stateful CRUD Persistence',
      playground: 'Yes (Per-Session Overlay)',
      jsonplaceholder: 'No (Static Dummy Return)',
      dummyjson: 'No (Static Dummy Return)',
      jsonServer: 'Yes (Local disk / file)',
    },
    {
      feature: 'Multi-User Collision Isolation',
      playground: 'Yes (Isolated Sandboxes)',
      jsonplaceholder: 'No persistence',
      dummyjson: 'No persistence',
      jsonServer: 'No (Shared local file)',
    },
    {
      feature: 'GraphQL Gateway & IDE',
      playground: 'Yes (/api/v1/graphql)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'No (Requires plugin)',
    },
    {
      feature: 'Artificial Latency Simulation',
      playground: 'Yes (?_delay=1500)',
      jsonplaceholder: 'No',
      dummyjson: 'Yes (?delay=1000)',
      jsonServer: 'CLI flag only',
    },
    {
      feature: 'HTTP Error Simulation',
      playground: 'Yes (?_status=500)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'No',
    },
    {
      feature: 'Fake JWT Auth Loops',
      playground: 'Yes (/auth/login & /auth/me)',
      jsonplaceholder: 'No',
      dummyjson: 'Basic token',
      jsonServer: 'Requires json-server-auth',
    },
    {
      feature: 'Dynamic Custom Collections',
      playground: 'Yes (/custom/:collection)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'Manual JSON edit',
    },
    {
      feature: 'Vector SVG Avatar Generator',
      playground: 'Yes (/avatars/:seed)',
      jsonplaceholder: 'No',
      dummyjson: 'External URLs',
      jsonServer: 'No',
    },
    {
      feature: 'Snapshot Export/Import (JSON)',
      playground: 'Yes (1-Click UI & API)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'Manual file backup',
    },
    {
      feature: 'OpenAPI 3.0 & Postman Specs',
      playground: 'Yes (Live Download)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'No',
    },
    {
      feature: 'AI Model Knowledge Specs (/llms.txt)',
      playground: 'Yes (/llms.txt & /product.json)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'No',
    },
  ];

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Playground API vs Alternatives
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          An objective comparison of feature capabilities, state management, and developer tools across popular mock API services.
        </p>
      </div>

      {/* 2. Feature Comparison Matrix */}
      <div id="comparison-matrix" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Feature Comparison Matrix
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-border-theme bg-bg-tertiary/40 text-text-muted font-semibold">
                <th className="p-3.5">Capability / Feature</th>
                <th className="p-3.5 text-accent-primary font-bold">Playground API</th>
                <th className="p-3.5">JSONPlaceholder</th>
                <th className="p-3.5">DummyJSON</th>
                <th className="p-3.5">json-server</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              {comparisonMatrix.map((row) => (
                <tr key={row.feature} className="hover:bg-bg-tertiary/30 transition-colors">
                  <td className="p-3.5 font-semibold text-text-primary">{row.feature}</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold bg-accent-light/10">
                    {row.playground}
                  </td>
                  <td className="p-3.5 text-text-muted">{row.jsonplaceholder}</td>
                  <td className="p-3.5 text-text-muted">{row.dummyjson}</td>
                  <td className="p-3.5 text-text-muted">{row.jsonServer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Deep Dive Summaries */}
      <div id="deep-dives" className="space-y-6 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">Detailed Breakdown</h2>

        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <div className="p-5 rounded-2xl bg-bg-secondary border border-border-theme space-y-2">
            <h3 className="text-base font-bold text-text-primary">vs JSONPlaceholder</h3>
            <p>
              JSONPlaceholder is widely loved for quick demos, but all mutations are dummy mocks. Creating a post with <code className="font-mono">POST /posts</code> returns an object with ID 101, but the item immediately disappears on subsequent requests. Playground API maintains per-session virtual overlays so creates, updates, and deletes persist throughout your prototyping session.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-bg-secondary border border-border-theme space-y-2">
            <h3 className="text-base font-bold text-text-primary">vs json-server</h3>
            <p>
              <code className="font-mono">json-server</code> is great for local development, but requires Node.js installation, local JSON file maintenance, and cannot be easily shared with teammates or mobile devices without running a public tunnel. Playground API is globally accessible with zero setup and automatic multi-user session isolation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
