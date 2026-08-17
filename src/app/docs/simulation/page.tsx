import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Network & Chaos Simulation',
  description: 'Simulate slow networks and HTTP error codes with query parameters and headers.',
};

export default function SimulationPage() {
  const querySample = `// 1. Simulate 1.5-second network latency
fetch('${config.publicApiUrl}/posts?_delay=1500')

// 2. Simulate 500 Internal Server Error
fetch('${config.publicApiUrl}/posts?_status=500')

// 3. Combined Delay & 404 Not Found
fetch('${config.publicApiUrl}/users/999?_delay=2000&_status=404')`;

  const headerSample = `// Clean Header-Based Simulation
fetch('${config.publicApiUrl}/posts', {
  headers: {
    'X-Simulate-Delay': '2000', // 2-second delay
    'X-Simulate-Status': '503', // 503 Service Unavailable
  },
})`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Network Delay & Error Simulation
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Test frontend loading skeletons, spinner UI transitions, and React error boundaries by simulating network conditions with zero backend changes.
        </p>
      </div>

      {/* 2. Latency Simulation */}
      <div id="delay-simulation" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          1. Simulating Network Latency (?_delay=ms)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Pass <code className="font-mono text-accent-primary">?_delay=&lt;ms&gt;</code> or header <code className="font-mono text-accent-primary">X-Simulate-Delay: &lt;ms&gt;</code> (up to 5000ms max).
        </p>
        <CodeBlock code={querySample} language="javascript" title="simulateQuery.js" />
      </div>

      {/* 3. Header Simulation */}
      <div id="header-simulation" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          2. Header-Based Simulation (Clean URLs)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Pass simulation flags as HTTP request headers to keep URLs clean in production:
        </p>
        <CodeBlock code={headerSample} language="javascript" title="simulateHeaders.js" />
      </div>

      {/* 4. Bottom Navigation */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        <Link
          href="/docs/recipes"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
            <span>Framework Recipes</span>
          </div>
        </Link>

        <Link
          href="/docs/posts"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
        >
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
            <span>Posts Collection</span>
          </div>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
