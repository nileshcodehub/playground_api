'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function HeroSection() {
  const [activeAction, setActiveAction] = useState<'create' | 'fetch' | 'delay' | 'reset'>('create');
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>(
    config.publicApiUrl || `${config.siteUrl}${config.apiUrl || '/api/v1'}`
  );
  const [consoleOutput, setConsoleOutput] = useState<any>({
    message: 'Click any action below to test live sandbox persistence in real-time!',
    sandboxStatus: 'Active Session Overlay',
    endpoint: `${config.publicApiUrl}/posts`,
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl?.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl?.startsWith('/') ? '' : '/'}${config.apiUrl || 'api/v1'}`;
      setBaseUrl(apiPrefix);
      setConsoleOutput((prev: any) => ({
        ...prev,
        endpoint: `${apiPrefix}/posts`,
      }));
    }
  }, []);

  const handleAction = async (action: 'create' | 'fetch' | 'delay' | 'reset') => {
    setActiveAction(action);
    setLoading(true);

    try {
      if (action === 'create') {
        const res = await fetch(`${config.apiUrl}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: '✨ My First Sandbox Post',
            body: 'This item was created in real-time and persists in your private session overlay!',
            user_id: 1,
          }),
        });
        const data = await res.json();
        setConsoleOutput({
          status: '201 Created (Persisted in your sandbox!)',
          createdRecord: data,
          notice: 'Now click "2. Fetch Posts" to see your new record at the top of the list!',
        });
      } else if (action === 'fetch') {
        const res = await fetch(`${config.apiUrl}/posts?_limit=3`, {
          credentials: 'include',
        });
        const data = await res.json();
        setConsoleOutput({
          status: '200 OK',
          pagination: data.pagination,
          posts: data.data || data,
        });
      } else if (action === 'delay') {
        const start = performance.now();
        const res = await fetch(`${config.apiUrl}/posts?_limit=2&_delay=1500`, {
          credentials: 'include',
          headers: { 'X-Simulate-Delay': '1500' },
        });
        const data = await res.json();
        const timeMs = Math.round(performance.now() - start);
        setConsoleOutput({
          status: `200 OK (Simulated Latency: ${timeMs}ms)`,
          description: 'Tested slow 3G network simulation without code changes!',
          sample: (data.data || data)[0],
        });
      } else if (action === 'reset') {
        const res = await fetch(`${config.apiUrl}/session/reset`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        setConsoleOutput({
          status: '200 OK (Clean Slate Restored)',
          message: data.message || 'Session sandbox mutations purged. Baseline global data restored.',
        });
      }
    } catch {
      setConsoleOutput({
        status: 'Request Complete',
        action,
        endpoint: `${baseUrl}/posts`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 border-b border-border-theme bg-linear-to-b from-bg-primary via-bg-secondary/60 to-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center relative z-10">
        {/* Version Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-light border border-accent-primary/30 text-accent-primary text-xs sm:text-sm font-semibold shadow-xs">
          <Icon icon="ph:sparkle-fill" className="w-4 h-4 text-accent-primary animate-pulse" />
          <span>Playground API {config.apiVersion} — Stateful Mock Backend</span>
          <span className="text-text-muted">|</span>
          <span className="underline underline-offset-2 font-mono">/api/v1/posts</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary leading-tight">
            The Mock API That{' '}
            <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Actually Remembers
            </span>{' '}
            Your Data
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Full CRUD REST & GraphQL mock backend with isolated per-user state persistence. Test fake logins, create custom resources, simulate slow 3G networks, and export state snapshots — zero setup required.
          </p>
        </div>

        {/* Live Interactive Hero Demo Widget */}
        <div className="max-w-3xl mx-auto text-left rounded-2xl glass-panel border border-border-theme p-4 sm:p-6 space-y-4 shadow-2xl bg-bg-secondary/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-theme">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-xs font-bold text-text-primary">
                Live Interactive Sandbox Tester
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Private Overlay Active
            </span>
          </div>

          {/* 4 Quick Action Test Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleAction('create')}
              disabled={loading}
              className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-1 ${
                activeAction === 'create'
                  ? 'bg-accent-primary text-white border-accent-primary shadow-md'
                  : 'bg-bg-tertiary hover:bg-border-theme text-text-secondary border-border-theme'
              }`}
            >
              <span className="text-[10px] opacity-75 font-sans font-normal">Step 1: Mutate</span>
              <span className="flex items-center gap-1">
                <Icon icon="ph:plus-circle-bold" className="w-3.5 h-3.5" />
                <span>POST /posts</span>
              </span>
            </button>

            <button
              onClick={() => handleAction('fetch')}
              disabled={loading}
              className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-1 ${
                activeAction === 'fetch'
                  ? 'bg-accent-primary text-white border-accent-primary shadow-md'
                  : 'bg-bg-tertiary hover:bg-border-theme text-text-secondary border-border-theme'
              }`}
            >
              <span className="text-[10px] opacity-75 font-sans font-normal">Step 2: Inspect</span>
              <span className="flex items-center gap-1">
                <Icon icon="ph:list-bullets-bold" className="w-3.5 h-3.5" />
                <span>GET /posts</span>
              </span>
            </button>

            <button
              onClick={() => handleAction('delay')}
              disabled={loading}
              className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-1 ${
                activeAction === 'delay'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                  : 'bg-bg-tertiary hover:bg-border-theme text-text-secondary border-border-theme'
              }`}
            >
              <span className="text-[10px] opacity-75 font-sans font-normal">Step 3: Simulate</span>
              <span className="flex items-center gap-1">
                <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
                <span>?_delay=1500</span>
              </span>
            </button>

            <button
              onClick={() => handleAction('reset')}
              disabled={loading}
              className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-1 ${
                activeAction === 'reset'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : 'bg-bg-tertiary hover:bg-border-theme text-text-secondary border-border-theme'
              }`}
            >
              <span className="text-[10px] opacity-75 font-sans font-normal">Step 4: Clean</span>
              <span className="flex items-center gap-1">
                <Icon icon="ph:arrow-counter-clockwise-bold" className="w-3.5 h-3.5" />
                <span>Reset State</span>
              </span>
            </button>
          </div>

          {/* Console Output Display */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-accent-primary">
                  <Icon icon="ph:spinner-bold" className="w-5 h-5 animate-spin" />
                  <span>Processing sandbox mutation...</span>
                </div>
              </div>
            )}
            <CodeBlock
              code={consoleOutput}
              language="json"
              title="Live Sandbox Response Terminal"
              maxHeight="max-h-56"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/docs/introduction"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent-primary hover:bg-accent-hover text-white text-sm sm:text-base font-bold shadow-lg shadow-accent-primary/25 transition-all hover:scale-105"
          >
            <Icon icon="ph:book-open-text-bold" className="w-5 h-5" />
            Explore Documentation
          </Link>
          <Link
            href="/docs/studio"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-sm sm:text-base font-bold transition-all hover:scale-105"
          >
            <Icon icon="ph:play-circle-bold" className="w-5 h-5 text-accent-primary" />
            Interactive API Studio
          </Link>
          <Link
            href="/docs/showcase"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-sm sm:text-base font-bold transition-all hover:scale-105"
          >
            <Icon icon="ph:rocket-launch-bold" className="w-5 h-5 text-emerald-400" />
            Live React Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
