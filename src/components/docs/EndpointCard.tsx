'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { TryItRunner } from './TryItRunner';
import config from '@/config/env';

interface EndpointCardProps {
  endpoint: EndpointDef;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  const [showTryIt, setShowTryIt] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const fullUrl = `${config.publicApiUrl}${endpoint.path}`;

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
    <div id={endpoint.id} data-toc-title={endpoint.title} className="space-y-4 scroll-mt-20 pt-6 border-t border-border-theme first:pt-0 first:border-t-0">
      {/* 1. Clean Title & Description */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {endpoint.title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {endpoint.description}
        </p>
      </div>

      {/* 2. Request Section (Terminal Box) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-muted font-semibold uppercase tracking-wider">
          <span>Request</span>
        </div>
        <div className="flex items-center justify-between bg-bg-secondary dark:bg-code-bg border border-border-theme rounded-xl px-4 py-3 font-mono text-xs sm:text-sm shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`font-bold px-2 py-0.5 rounded-md border text-[11px] sm:text-xs ${getMethodBadgeClass(endpoint.method)}`}>
              {endpoint.method}
            </span>
            <span className="text-text-primary select-all truncate">{fullUrl}</span>
          </div>
          <button
            onClick={handleCopyUrl}
            title="Copy URL"
            className="text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0 ml-3 flex items-center gap-1.5 text-xs font-sans font-medium"
          >
            <Icon icon={copiedUrl ? 'ph:check-bold' : 'ph:copy-bold'} className={`w-4 h-4 ${copiedUrl ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{copiedUrl ? 'Copied' : 'Copy'}</span>
          </button>
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
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Request Body</span>
          <CodeBlock
            code={endpoint.requestBody}
            language="json"
            maxHeight="max-h-60"
            showHeader={false}
          />
        </div>
      )}

      {/* 5. Response Section */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-text-muted font-semibold uppercase tracking-wider">
          <span>Response (JSON)</span>
          <button
            onClick={() => setShowTryIt(!showTryIt)}
            className="text-accent-primary hover:underline transition-all cursor-pointer font-sans font-bold normal-case flex items-center gap-1"
          >
            <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
            <span>{showTryIt ? 'Hide Live Tester' : 'Try this endpoint live'}</span>
          </button>
        </div>
        <CodeBlock
          code={endpoint.responseExample}
          language={typeof endpoint.responseExample === 'string' && endpoint.responseExample.startsWith('<svg') ? 'svg' : 'json'}
          maxHeight="max-h-72"
          showHeader={false}
        />
      </div>

      {/* 6. Collapsible Try-It Tester */}
      {showTryIt && (
        <div className="pt-2 animate-in fade-in duration-150">
          <TryItRunner endpoint={endpoint} defaultExpanded={true} />
        </div>
      )}
    </div>
  );
}
