'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import { MethodBadge } from './MethodBadge';
import { CodeGenerators } from './CodeGenerators';
import { TryItRunner } from './TryItRunner';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface EndpointCardProps {
  endpoint: EndpointDef;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  const hasParams = endpoint.queryParams && endpoint.queryParams.length > 0;
  const hasBody = Boolean(endpoint.requestBody);

  // Tab State: 'overview' | 'code' | 'response' | 'try'
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'response' | 'try'>('overview');
  const [copiedPath, setCopiedPath] = useState(false);

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(endpoint.path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const getDevNote = () => {
    switch (endpoint.method) {
      case 'POST':
        return 'Mutations are stored in your private session sandbox. The returned ID will have the local-<uuid> format and will immediately appear at the top of subsequent GET list queries.';
      case 'PUT':
      case 'PATCH':
        return 'Updates apply strictly to your active session overlay. The modified record keeps its position in the list and preserves custom fields.';
      case 'DELETE':
        return 'Deletes hide the record from your session view (returning 204 No Content). Baseline seed data remains intact for other visitors.';
      case 'GET':
        return endpoint.path.includes(':')
          ? 'Fetches a single record. Supports both global baseline integer IDs (e.g. 1) and your local sandbox string IDs (local-<uuid>).'
          : 'Merges global baseline records with your session mutations (creates at top, updates in-place, deletes filtered out). Supports pagination, search, and sorting.';
      default:
        return 'Standard RESTful operation isolated within your private session identity.';
    }
  };

  return (
    <div
      id={endpoint.id}
      data-toc-title={endpoint.title}
      className="rounded-2xl glass-panel border border-border-theme overflow-hidden scroll-mt-20 shadow-xl transition-all hover:border-accent-primary/40"
    >
      {/* 1. Header Bar */}
      <div className="p-5 sm:p-6 border-b border-border-theme/70 bg-bg-secondary/40 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <MethodBadge method={endpoint.method} />
            <button
              onClick={handleCopyPath}
              title="Click to copy endpoint path"
              className="group/path inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-text-primary bg-bg-tertiary hover:bg-border-theme px-3 py-1.5 rounded-xl border border-border-theme transition-all cursor-pointer select-all"
            >
              <span>{endpoint.path}</span>
              <Icon
                icon={copiedPath ? 'ph:check-bold' : 'ph:copy-bold'}
                className={`w-3.5 h-3.5 transition-colors ${copiedPath ? 'text-emerald-400' : 'text-text-muted group-hover/path:text-text-primary'}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-text-muted px-2 py-0.5 rounded-md bg-bg-tertiary border border-border-theme">
              #{endpoint.id}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
            {endpoint.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
            {endpoint.description}
          </p>
        </div>

        {/* Developer Context Callout */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-accent-light/10 border border-accent-primary/20 text-xs text-text-secondary">
          <Icon icon="ph:lightbulb-filament-bold" className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
          <span>
            <strong className="text-text-primary font-semibold">In your application: </strong>
            {getDevNote()}
          </span>
        </div>
      </div>

      {/* 2. Clean Segmented Navigation Tabs */}
      <div className="px-5 sm:px-6 pt-3 border-b border-border-theme/70 bg-bg-secondary/20 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'text-accent-primary border-accent-primary bg-bg-secondary'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-tertiary/50'
          }`}
        >
          <Icon icon="ph:list-bullets-bold" className="w-4 h-4" />
          <span>Overview & Parameters</span>
          {(hasParams || hasBody) && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-accent-light text-accent-primary font-mono">
              {(endpoint.queryParams?.length || 0) + (hasBody ? 1 : 0)}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'code'
              ? 'text-accent-primary border-accent-primary bg-bg-secondary'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-tertiary/50'
          }`}
        >
          <Icon icon="ph:code-bold" className="w-4 h-4" />
          <span>Code Snippets</span>
        </button>

        <button
          onClick={() => setActiveTab('response')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'response'
              ? 'text-accent-primary border-accent-primary bg-bg-secondary'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-tertiary/50'
          }`}
        >
          <Icon icon="ph:file-json-bold" className="w-4 h-4" />
          <span>Response Example</span>
        </button>

        <button
          onClick={() => setActiveTab('try')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 transition-all cursor-pointer shrink-0 ml-auto ${
            activeTab === 'try'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/10'
              : 'text-emerald-500 hover:text-emerald-400 border-transparent hover:bg-emerald-500/10'
          }`}
        >
          <Icon icon="ph:lightning-fill" className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Interactive Try-It</span>
        </button>
      </div>

      {/* 3. Tab Body Panels */}
      <div className="p-5 sm:p-6 bg-bg-secondary/10">
        {/* TAB 1: OVERVIEW & PARAMETERS */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Query / Path Parameters */}
            {hasParams ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                    <Icon icon="ph:sliders-bold" className="w-4 h-4 text-accent-primary" />
                    Query & Path Parameters
                  </h4>
                  <span className="text-xs text-text-muted">{endpoint.queryParams?.length} available</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary/60">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-bg-tertiary/70 text-text-primary font-bold border-b border-border-theme font-mono">
                        <th className="p-3">Parameter</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Requirement</th>
                        <th className="p-3">Default</th>
                        <th className="p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme text-text-secondary font-mono">
                      {endpoint.queryParams?.map((q) => (
                        <tr key={q.name} className="hover:bg-bg-tertiary/30 transition-colors">
                          <td className="p-3 text-accent-primary font-bold">{q.name}</td>
                          <td className="p-3 text-text-muted">{q.type}</td>
                          <td className="p-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                q.required
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {q.required ? 'Required' : 'Optional'}
                            </span>
                          </td>
                          <td className="p-3 text-text-muted">{q.defaultVal || '—'}</td>
                          <td className="p-3 font-sans text-text-secondary leading-relaxed">{q.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-bg-secondary/40 border border-border-theme text-xs sm:text-sm text-text-muted flex items-center gap-2">
                <Icon icon="ph:info-bold" className="w-4 h-4 text-accent-primary shrink-0" />
                <span>No query or path parameters required for this endpoint. Send a direct request to the path.</span>
              </div>
            )}

            {/* Request Body Payload if applicable */}
            {hasBody && (
              <div className="space-y-2 pt-2 border-t border-border-theme/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Icon icon="ph:cube-bold" className="w-4 h-4" />
                    Request Payload Body (JSON)
                  </h4>
                  <span className="text-xs text-text-muted">Content-Type: application/json</span>
                </div>
                <CodeBlock
                  code={endpoint.requestBody}
                  language="json"
                  maxHeight="max-h-60"
                />
              </div>
            )}

            {/* Quick Actions to Try-It */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('try')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Icon icon="ph:lightning-fill" className="w-4 h-4" />
                <span>Test this endpoint live in Try-It</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className="text-xs sm:text-sm text-text-secondary hover:text-accent-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View code generators</span>
                <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CODE SNIPPETS */}
        {activeTab === 'code' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-text-secondary">
                Select your language / HTTP library:
              </span>
              <button
                onClick={() => setActiveTab('try')}
                className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Icon icon="ph:lightning-fill" className="w-3.5 h-3.5" />
                <span>Test Live</span>
              </button>
            </div>
            <CodeGenerators endpoint={endpoint} />
          </div>
        )}

        {/* TAB 3: RESPONSE EXAMPLE */}
        {activeTab === 'response' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <Icon icon="ph:check-circle-bold" className="w-4 h-4" />
                Standard 200 OK Response Schema
              </span>
              <span className="text-xs text-text-muted font-mono">Format: JSON</span>
            </div>
            <CodeBlock
              code={endpoint.responseExample}
              language={typeof endpoint.responseExample === 'string' && endpoint.responseExample.startsWith('<svg') ? 'svg' : 'json'}
              maxHeight="max-h-80"
            />
          </div>
        )}

        {/* TAB 4: INTERACTIVE TRY-IT RUNNER */}
        {activeTab === 'try' && (
          <div className="animate-in fade-in duration-150">
            <TryItRunner endpoint={endpoint} defaultExpanded={true} />
          </div>
        )}
      </div>
    </div>
  );
}
