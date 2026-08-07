import React from 'react';
import { EndpointDef } from '@/config/api-catalog';
import { MethodBadge } from './MethodBadge';
import { CodeGenerators } from './CodeGenerators';
import { TryItRunner } from './TryItRunner';

interface EndpointCardProps {
  endpoint: EndpointDef;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  return (
    <div id={endpoint.id} className="p-6 rounded-2xl glass-panel border border-border-theme space-y-6 scroll-mt-20 shadow-xl">
      {/* Endpoint Header Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <MethodBadge method={endpoint.method} />
            <span className="font-mono text-sm font-bold text-text-primary bg-bg-tertiary px-3 py-1 rounded-lg border border-border-theme select-all">
              {endpoint.path}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-text-muted">
            #{endpoint.id}
          </span>
        </div>
        <h3 className="text-lg font-bold text-text-primary pt-1">{endpoint.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{endpoint.description}</p>
      </div>

      {/* Query / Path Parameters Table */}
      {endpoint.queryParams && endpoint.queryParams.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            QUERY / PATH PARAMETERS
          </h4>
          <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-tertiary text-text-primary font-bold border-b border-border-theme font-mono">
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Required</th>
                  <th className="p-3">Default</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme text-text-secondary font-mono">
                {endpoint.queryParams.map((q) => (
                  <tr key={q.name}>
                    <td className="p-3 text-accent-primary font-bold">{q.name}</td>
                    <td className="p-3 text-text-muted">{q.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          q.required
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {q.required ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td className="p-3 text-text-muted">{q.defaultVal || '-'}</td>
                    <td className="p-3 font-sans text-text-secondary">{q.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Code Snippet Runner */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          REQUEST CODE GENERATOR
        </h4>
        <CodeGenerators endpoint={endpoint} />
      </div>

      {/* Request Body & Response JSON Examples */}
      <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border-theme">
        {endpoint.requestBody && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">Request Body (JSON)</span>
            <div className="p-4 rounded-xl bg-code-bg border border-border-theme font-mono text-xs text-gray-200 overflow-x-auto max-h-64 overflow-y-auto leading-relaxed">
              <pre>
                <code>{JSON.stringify(endpoint.requestBody, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Response JSON Example</span>
          <div className="p-4 rounded-xl bg-code-bg border border-border-theme font-mono text-xs text-gray-200 overflow-x-auto max-h-64 overflow-y-auto leading-relaxed">
            <pre>
              <code>{typeof endpoint.responseExample === 'string' ? endpoint.responseExample : JSON.stringify(endpoint.responseExample, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>


      {/* Interactive Try-It Runner */}
      <div className="pt-2">
        <TryItRunner endpoint={endpoint} />
      </div>
    </div>
  );
}
