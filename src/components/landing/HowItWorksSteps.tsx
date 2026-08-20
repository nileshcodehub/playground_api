'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export function HowItWorksSteps() {
  const steps = [
    {
      step: '01',
      title: 'Point Your API Client',
      description:
        'Swap your API base URL to our public endpoint in your React, Vue, Next.js, or mobile app. No registration, API keys, or database setup required.',
      icon: 'ph:plug-bold',
      codeSnippet: `const API_URL = 'https://playground-api-xi.vercel.app/api/v1';\n\nconst posts = await fetch(\`\${API_URL}/posts\`);`,
      tag: 'Instant Setup',
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      step: '02',
      title: 'Automatic Isolated Sandbox',
      description:
        'Every visitor automatically gets a secure session identity. Your created posts, updated profiles, and deleted items persist privately in your browser without altering global baseline data.',
      icon: 'ph:shield-check-bold',
      codeSnippet: `// All CRUD operations persist in your private overlay\nawait fetch('/api/v1/posts', {\n  method: 'POST',\n  body: JSON.stringify({ title: 'My Item' })\n});`,
      tag: 'Zero Conflict',
      accentColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      step: '03',
      title: 'Simulate Edge Cases & Export',
      description:
        'Test loading skeletons with ?_delay=1500, verify error boundaries with ?_status=500, authenticate with fake JWT Bearer tokens, or export your full sandbox snapshot as JSON.',
      icon: 'ph:rocket-launch-bold',
      codeSnippet: `// Simulate slow 3G network latency\nfetch('/api/v1/posts?_delay=1500');\n\n// Or simulate a 500 error boundary\nfetch('/api/v1/posts?_status=500');`,
      tag: 'Edge-Case Ready',
      accentColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <section className="py-20 bg-bg-primary border-b border-border-theme relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold font-mono">
            <Icon icon="ph:git-branch-bold" className="w-4 h-4" />
            <span>Architecture & Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Get a production-grade mock backend for your frontend development in under 10 seconds.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-7 rounded-3xl glass-panel border border-border-theme hover:border-accent-primary/50 transition-all flex flex-col justify-between space-y-6 group shadow-sm hover:shadow-xl relative"
            >
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent-primary flex items-center justify-center font-extrabold text-base group-hover:scale-110 transition-transform">
                    <Icon icon={item.icon} className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-text-muted/40 group-hover:text-accent-primary/60 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${item.bgColor} ${item.accentColor}">
                    {item.tag}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="p-3.5 rounded-2xl bg-code-bg border border-border-theme font-mono text-[11px] text-text-secondary overflow-x-auto">
                <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
                  {item.codeSnippet}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="text-center pt-4">
          <Link
            href="/docs/how-it-works"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-accent-primary hover:underline"
          >
            <span>Learn more about how our session overlay engine works behind the scenes</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
export default HowItWorksSteps;
