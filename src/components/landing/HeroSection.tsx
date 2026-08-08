'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const sampleCurl = `curl -X GET ${config.publicApiUrl || config.apiUrl}/posts?_limit=5`;


  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 border-b border-border-theme bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center relative z-10">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-light border border-accent-primary/30 text-accent-primary text-xs font-semibold shadow-xs animate-bounce">
          <Icon icon="ph:sparkle-fill" className="w-4 h-4 text-accent-primary" />
          <span>Playground API {config.apiVersion} Released</span>
          <span className="text-text-muted">|</span>
          <span className="underline underline-offset-2 font-mono">/api/v1/posts</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary leading-tight">
            Free, Instant & Sandboxed{' '}
            <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mock REST & GraphQL API
            </span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            The next-generation prototyping API. Perform real POST, PUT, PATCH, and DELETE mutations with isolated per-user sandbox state overlays. Zero setup required.
          </p>
        </div>

        {/* Quick cURL Bar */}
        <div className="max-w-xl mx-auto text-left shadow-xl">
          <CodeBlock
            code={`$ ${sampleCurl}`}
            language="curl"
            showHeader={false}
            showLineNumbers={false}
            oddEvenZebra={false}
            copyable={true}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/docs/introduction"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold shadow-lg shadow-accent-primary/25 transition-all hover:scale-105"
          >
            <Icon icon="ph:book-open-text-bold" className="w-5 h-5" />
            Explore Documentation
          </Link>
          <Link
            href="/docs/studio"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-sm font-bold transition-all hover:scale-105"
          >
            <Icon icon="ph:play-circle-bold" className="w-5 h-5 text-accent-primary" />
            Interactive API Studio
          </Link>
        </div>
      </div>
    </section>
  );
}
