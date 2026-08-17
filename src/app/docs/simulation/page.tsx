import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Network Delay & Error Simulation',
  description: 'Simulate slow networks, artificial latency, and HTTP error codes using simple query parameters or headers.',
};

export default function SimulationPage() {
  const querySample = `// 1. Query parameter delay (1.5 seconds)
fetch('${config.publicApiUrl}/posts?_limit=5&_delay=1500')

// 2. Query parameter status override (500 Server Error)
fetch('${config.publicApiUrl}/posts?_status=500')

// 3. Combined Delay & Error Simulation
fetch('${config.publicApiUrl}/users/1?_delay=2000&_status=404')`;

  const headerSample = `// Header-based simulation (Zero URL pollution)
fetch('${config.publicApiUrl}/posts', {
  headers: {
    'X-Simulate-Delay': '2000',  // 2-second artificial latency
    'X-Simulate-Status': '503', // 503 Service Unavailable
  },
})`;

  return (
    <div className="space-y-12 w-full max-w-none">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 border-b border-border-theme/60 pb-8 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold font-mono">
          <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
          <span>Resilience & Chaos Testing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Network Delay & Error Simulation
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
          Test frontend loading skeletons, spinner UI transitions, offline fallbacks, and React error boundaries by simulating network conditions with zero backend changes.
        </p>
      </div>

      {/* 2. Latency Simulation */}
      <div id="delay-simulation" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:clock-afternoon-bold" className="w-5 h-5 text-purple-400" />
          1. Simulating Network Latency (?_delay=ms)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Pass <code className="font-mono text-purple-400">?_delay=&lt;milliseconds&gt;</code> or the header <code className="font-mono text-purple-400">X-Simulate-Delay: &lt;ms&gt;</code>. The backend delays response delivery for the specified duration (up to 5000ms max).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme">
            <strong className="text-text-primary text-xs font-mono block">?_delay=500</strong>
            <span className="text-xs text-text-muted">Fast 4G / 5G Latency</span>
          </div>
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme">
            <strong className="text-text-primary text-xs font-mono block">?_delay=1500</strong>
            <span className="text-xs text-text-muted">Slow 3G / Mobile Latency</span>
          </div>
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme">
            <strong className="text-text-primary text-xs font-mono block">?_delay=3000</strong>
            <span className="text-xs text-text-muted">High Latency / Satellite</span>
          </div>
        </div>
      </div>

      {/* 3. Status Code Override */}
      <div id="status-simulation" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:warning-circle-bold" className="w-5 h-5 text-amber-400" />
          2. Simulating HTTP Error Codes (?_status=code)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Pass <code className="font-mono text-amber-400">?_status=&lt;code&gt;</code> or the header <code className="font-mono text-amber-400">X-Simulate-Status: &lt;code&gt;</code> to force specific HTTP status codes between 400 and 599.
        </p>
        <CodeBlock code={querySample} language="javascript" title="simulateQuery.js" />
      </div>

      {/* 4. Header-Based Simulation */}
      <div id="header-simulation" className="space-y-4 p-8 rounded-3xl bg-bg-secondary/40 border border-border-theme/60 shadow-sm scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:sliders-bold" className="w-5 h-5 text-accent-primary" />
          3. Header-Based Simulation (Clean URLs)
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          If you prefer keeping URL query strings clean in production, pass simulation flags as HTTP request headers:
        </p>
        <CodeBlock code={headerSample} language="javascript" title="simulateHeaders.js" />
      </div>

      {/* 5. Navigation Footer */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/docs/studio"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary" />
          <span>Prev: Interactive API Studio</span>
        </Link>
        <Link
          href="/docs/export-import"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all ml-auto"
        >
          <span>Next: Snapshot Export & Import</span>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
