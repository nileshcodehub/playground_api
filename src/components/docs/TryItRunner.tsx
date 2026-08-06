'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef } from '@/config/api-catalog';
import config from '@/config/env';

interface TryItRunnerProps {
  endpoint: EndpointDef;
}

export function TryItRunner({ endpoint }: TryItRunnerProps) {
  const [loading, setLoading] = useState(false);
  const [requestBody, setRequestBody] = useState(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : ''
  );
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    headers: Record<string, string>;
    data: unknown;
  } | null>(null);

  const fullUrl = `${config.apiUrl}${endpoint.path}`;

  const handleExecute = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(fullUrl, options);
      const timeMs = Math.round(performance.now() - startTime);

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      const headers: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headers[key] = val;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        headers,
        data,
      });
    } catch (err) {
      const timeMs = Math.round(performance.now() - startTime);
      setResponse({
        status: 0,
        statusText: 'Network Error',
        timeMs,
        headers: {},
        data: { error: String(err) },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-border-theme bg-bg-secondary p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
          <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
          Interactive Request Runner & Inspector
        </h4>
        <button
          onClick={handleExecute}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-hover disabled:opacity-50 text-white font-sans text-xs font-bold transition-all cursor-pointer shadow-md"
        >
          <Icon icon={loading ? 'ph:spinner-bold' : 'ph:paper-plane-right-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Executing...' : 'Run Request'}</span>
        </button>
      </div>

      {/* Editable Request Body if POST/PUT/PATCH */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-text-secondary">Request Body (JSON):</label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            rows={4}
            className="w-full font-mono text-xs p-3 rounded-lg bg-code-bg border border-border-theme text-gray-200 focus:outline-none focus:border-accent-primary"
          />
        </div>
      )}

      {/* Response Inspector Display */}
      {response && (
        <div className="space-y-3 pt-2 border-t border-border-theme animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-secondary">Status:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                }`}
              >
                {response.status} {response.statusText}
              </span>
            </div>
            <div className="flex items-center gap-1 text-text-muted font-mono text-[11px]">
              <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
              <span>{response.timeMs} ms</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-text-secondary">Response Payload:</span>
            <pre className="p-4 rounded-lg bg-code-bg border border-border-theme font-mono text-xs text-gray-200 overflow-x-auto max-h-64">
              <code>{JSON.stringify(response.data, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
