'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function HeroSection() {
  const [activeAction, setActiveAction] = useState<'create' | 'fetch' | 'delay' | 'reset'>('create');
  const [loading, setLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<string>('201 Created');

  const [baseUrl, setBaseUrl] = useState<string>(
    config.publicApiUrl || `${config.siteUrl}${config.apiUrl || '/api/v1'}`
  );

  const [consoleOutput, setConsoleOutput] = useState<any>({
    id: 101,
    title: '✨ My First Sandbox Post',
    body: 'This item was created in real-time and persists in your private session overlay!',
    user_id: 1,
    created_at: new Date().toISOString(),
    _sandbox: {
      persisted: true,
      isolated: true,
      note: 'Click "Fetch Posts" to see this record at the top of your list.',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl?.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl?.startsWith('/') ? '' : '/'}${config.apiUrl || 'api/v1'}`;
      setBaseUrl(apiPrefix);
    }
  }, []);

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(`curl -X GET "${baseUrl}/posts?_limit=5"`);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleAction = async (action: 'create' | 'fetch' | 'delay' | 'reset') => {
    setActiveAction(action);
    setLoading(true);
    const start = performance.now();

    try {
      if (action === 'create') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/posts`, {
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
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus('201 Created');
        setConsoleOutput(data);
      } else if (action === 'fetch') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/posts?_limit=3`, {
          credentials: 'include',
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus('200 OK');
        setConsoleOutput(data);
      } else if (action === 'delay') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/posts?_limit=2&_delay=1200`, {
          credentials: 'include',
          headers: { 'X-Simulate-Delay': '1200' },
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus(`200 OK (${elapsed}ms)`);
        setConsoleOutput({
          notice: 'Simulated 3G network latency injected seamlessly via header/param.',
          latency: `${elapsed}ms`,
          data: (data.data || data)[0],
        });
      } else if (action === 'reset') {
        const res = await fetch(`${config.apiUrl || '/api/v1'}/session/reset`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        setLatencyMs(elapsed);
        setResponseStatus('200 OK (Purged)');
        setConsoleOutput({
          status: 'success',
          message: data.message || 'Session sandbox mutations purged. Baseline global data restored.',
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setResponseStatus('200 OK (Local Sample)');
      setConsoleOutput({
        endpoint: `${baseUrl}/posts`,
        action,
        status: 'Sample response displayed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 border-b border-border-theme bg-linear-to-b from-bg-primary via-bg-secondary/40 to-bg-primary">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-75 h-75 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Value Proposition & Developer CTAs (Cols 6/12) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Release Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-accent-light border border-accent-primary/25 text-xs font-semibold text-accent-primary shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary" />
              </span>
              <span>Playground API {config.apiVersion}</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary font-medium">Stateful Mock API Engine</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-text-primary leading-[1.15]">
                The Mock API That{' '}
                <span className="text-accent-primary underline decoration-accent-primary/30 decoration-wavy underline-offset-4">
                  Actually Persists
                </span>{' '}
                Your Data
              </h1>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                A stateful JSONPlaceholder alternative for web and mobile development. Perform live CRUD mutations in isolated per-visitor sandboxes, simulate network delays, test JWT auth loops, and export state snapshots — zero backend setup required.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-accent-primary shrink-0" />
                <span>Isolated Per-Session Overlays</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-accent-primary shrink-0" />
                <span>REST & GraphQL Unified</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-accent-primary shrink-0" />
                <span>Fake JWT Auth & Bearer Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-accent-primary shrink-0" />
                <span>Network Delay & Chaos Headers</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/docs/introduction"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold shadow-md shadow-accent-primary/20 transition-all hover:scale-[1.02]"
              >
                <Icon icon="ph:book-open-text-bold" className="w-4 h-4" />
                <span>Explore Docs</span>
              </Link>
              <Link
                href="/docs/studio"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-sm font-bold transition-all hover:scale-[1.02]"
              >
                <Icon icon="ph:play-circle-bold" className="w-4 h-4 text-accent-primary" />
                <span>API Studio</span>
              </Link>
              <Link
                href="/docs/showcase"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary text-sm font-medium transition-all"
              >
                <Icon icon="ph:rocket-launch-bold" className="w-4 h-4 text-emerald-400" />
                <span>React Demo</span>
              </Link>
            </div>

            {/* Quick cURL Bar */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-bg-secondary border border-border-theme max-w-lg font-mono text-xs text-text-secondary">
              <div className="flex items-center gap-2 truncate">
                <span className="text-accent-primary font-bold select-none">$</span>
                <span className="truncate text-text-primary">curl {baseUrl}/posts</span>
              </div>
              <button
                onClick={handleCopyCurl}
                className="px-2.5 py-1 rounded-md bg-bg-tertiary hover:bg-border-theme text-[11px] font-sans font-semibold text-text-primary transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                title="Copy cURL Command"
              >
                <Icon icon={copiedCurl ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
                <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Social / Baseline Badges */}
            <div className="flex items-center gap-4 text-xs text-text-muted pt-1">
              <span>🚀 100+ Baseline Records</span>
              <span>•</span>
              <span>🔒 Zero Auth Required</span>
              <span>•</span>
              <span>⚡ 100% Free</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Interactive IDE Console Widget (Cols 6/12) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl glass-panel border border-border-theme shadow-2xl bg-bg-secondary/90 overflow-hidden">
              
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-theme bg-bg-tertiary/60">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs font-bold text-text-primary">
                    sandbox-session.json
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {latencyMs !== null && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border-theme">
                      ⚡ {latencyMs}ms
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    ● Live Sandbox
                  </span>
                </div>
              </div>

              {/* 4 Interactive Test Step Buttons */}
              <div className="p-3 border-b border-border-theme bg-bg-primary/40">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleAction('create')}
                    disabled={loading}
                    className={`px-2.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 ${
                      activeAction === 'create'
                        ? 'bg-accent-primary text-white border-accent-primary shadow-xs'
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border-border-theme'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-normal">1. Mutate</span>
                    <span className="truncate">POST /posts</span>
                  </button>

                  <button
                    onClick={() => handleAction('fetch')}
                    disabled={loading}
                    className={`px-2.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 ${
                      activeAction === 'fetch'
                        ? 'bg-accent-primary text-white border-accent-primary shadow-xs'
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border-border-theme'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-normal">2. Verify</span>
                    <span className="truncate">GET /posts</span>
                  </button>

                  <button
                    onClick={() => handleAction('delay')}
                    disabled={loading}
                    className={`px-2.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 ${
                      activeAction === 'delay'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border-border-theme'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-normal">3. Latency</span>
                    <span className="truncate">?_delay=1200</span>
                  </button>

                  <button
                    onClick={() => handleAction('reset')}
                    disabled={loading}
                    className={`px-2.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer text-left border flex flex-col gap-0.5 ${
                      activeAction === 'reset'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-bg-secondary hover:bg-bg-tertiary text-text-secondary border-border-theme'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-75 font-sans font-normal">4. Clean</span>
                    <span className="truncate">Reset State</span>
                  </button>
                </div>
              </div>

              {/* Status Header Bar above Output */}
              <div className="px-4 py-1.5 bg-bg-tertiary/40 border-b border-border-theme flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  <span>Status: <strong className="text-accent-primary">{responseStatus}</strong></span>
                </span>
                <span>Format: JSON</span>
              </div>

              {/* Response Code Block Terminal */}
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 bg-bg-primary/70 backdrop-blur-xs flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-accent-primary bg-bg-secondary px-3.5 py-2 rounded-xl border border-border-theme shadow-lg">
                      <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                      <span>Executing sandbox query...</span>
                    </div>
                  </div>
                )}
                <CodeBlock
                  code={consoleOutput}
                  language="json"
                  maxHeight="max-h-[19rem]"
                  showLineNumbers={true}
                  className="rounded-none border-0"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

