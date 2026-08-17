'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { TryItRunner } from './TryItRunner';
import { CodeGenerators } from './CodeGenerators';
import config from '@/config/env';

interface EndpointCardProps {
  endpoint: EndpointDef;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  const [activeTab, setActiveTab] = useState<'example' | 'code' | 'runner'>('example');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const baseApi = config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1';
  const cleanBase = baseApi.replace(/\/+$/, '');
  const cleanPath = endpoint.path.startsWith('/') ? endpoint.path : `/${endpoint.path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
      case 'POST':
        return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      case 'PUT':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'PATCH':
        return 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
      case 'DELETE':
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      default:
        return 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    }
  };

  return (
    <div id={endpoint.id} data-toc-title={endpoint.title} className="space-y-5 scroll-mt-20 pt-8 border-t border-border-theme first:pt-0 first:border-t-0">
      {/* 1. Clean Title & Description */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {endpoint.title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {endpoint.description}
        </p>
      </div>

      {/* 2. Request Section (Interactive Terminal Bar) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-muted font-semibold uppercase tracking-wider">
          <span>Request Endpoint</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-bg-secondary dark:bg-code-bg border border-border-theme rounded-2xl p-2.5 sm:px-4 sm:py-3 font-mono text-xs sm:text-sm shadow-xs gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className={`font-bold px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs shrink-0 ${getMethodBadgeClass(endpoint.method)}`}>
              {endpoint.method}
            </span>
            <span className="text-text-primary select-all truncate font-semibold">{fullUrl}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-end">
            <button
              onClick={handleCopyUrl}
              title="Copy URL"
              className="px-3 py-1.5 rounded-xl bg-bg-tertiary/60 hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all cursor-pointer flex items-center gap-1.5 text-xs font-sans font-semibold border border-border-theme"
            >
              <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className={`w-3.5 h-3.5 ${copiedUrl ? 'text-emerald-500' : ''}`} />
              <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
            </button>

            {/* HIGH-IMPACT PROMINENT "TRY LIVE" BUTTON */}
            <button
              onClick={() => setActiveTab(activeTab === 'runner' ? 'example' : 'runner')}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                activeTab === 'runner'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50'
              }`}
            >
              <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeTab === 'runner' ? 'Close Tester' : 'Try in Sandbox'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Query / Path Parameters if available */}
      {endpoint.queryParams && endpoint.queryParams.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Parameters</span>
          <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-theme bg-bg-tertiary/40 text-text-muted font-semibold">
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 font-sans">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme text-text-secondary">
                {endpoint.queryParams.map((q) => (
                  <tr key={q.name}>
                    <td className="p-3 font-bold text-accent-primary">{q.name}</td>
                    <td className="p-3 text-text-muted">{q.type}</td>
                    <td className="p-3 font-sans text-text-secondary">{q.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Request Body JSON if applicable */}
      {endpoint.requestBody && (
        <div className="space-y-2 pt-1">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Request Body Example</span>
          <CodeBlock
            code={endpoint.requestBody}
            language="json"
            maxHeight="max-h-60"
            showHeader={false}
          />
        </div>
      )}

      {/* 5. Segmented Tab Controls: Example, Multi-Language Code Snippets & Live Runner */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-theme pb-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-bg-secondary border border-border-theme w-fit flex-wrap">
            {/* Tab 1: Example Response */}
            <button
              onClick={() => setActiveTab('example')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'example'
                  ? 'bg-bg-primary text-text-primary shadow-xs border border-border-theme font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon icon="ph:file-code-bold" className="w-3.5 h-3.5" />
              <span>Example Response</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">200</span>
            </button>

            {/* Tab 2: Multi-Language Code Generators (cURL, JS, Python, Go, etc.) */}
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-bg-primary text-text-primary shadow-xs border border-border-theme font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon icon="ph:terminal-window-bold" className="w-3.5 h-3.5 text-blue-500" />
              <span>Code Snippets</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">9 SDKs</span>
            </button>

            {/* Tab 3: Live Sandbox Runner */}
            <button
              onClick={() => setActiveTab('runner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'runner'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <Icon icon="ph:play-circle-bold" className="w-3.5 h-3.5" />
              <span>Live Sandbox Runner</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          <span className="text-xs text-text-muted hidden sm:inline">
            {activeTab === 'runner' && 'Testing with isolated session persistence'}
            {activeTab === 'code' && 'cURL, JS, Axios, Python, Go, Swift, Rust'}
            {activeTab === 'example' && 'Static schema preview'}
          </span>
        </div>

        {/* View 1: Static Example Response */}
        {activeTab === 'example' && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <CodeBlock
              code={endpoint.responseExample}
              language={typeof endpoint.responseExample === 'string' && endpoint.responseExample.startsWith('<svg') ? 'svg' : 'json'}
              maxHeight="max-h-72"
              showHeader={false}
            />
          </div>
        )}

        {/* View 2: Multi-Language Code Snippets */}
        {activeTab === 'code' && (
          <div className="animate-in fade-in duration-150">
            <CodeGenerators endpoint={endpoint} />
          </div>
        )}

        {/* View 3: Full Live Interactive Runner */}
        {activeTab === 'runner' && (
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <TryItRunner endpoint={endpoint} defaultExpanded={true} />
          </div>
        )}
      </div>
    </div>
  );
}
