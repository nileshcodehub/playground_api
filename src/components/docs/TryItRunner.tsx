'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef, QueryParamDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useLiveCounts } from '@/context/CountsContext';
import config from '@/config/env';

interface TryItRunnerProps {
  endpoint: EndpointDef;
}

/**
 * Client-side SVG Sanitizer to strip script tags, event handlers, and dangerous attributes
 */
function sanitizeSvg(rawSvg: string): string {
  if (!rawSvg || typeof rawSvg !== 'string') return '';
  return rawSvg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(?:href|xlink:href)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, '');
}

const DEFAULT_GET_QUERY_PARAMS: QueryParamDef[] = [
  { name: 'q', type: 'string', description: 'Full-text search query term across fields.' },
  { name: 'page', type: 'integer', defaultVal: '1', description: 'Page number (1-indexed, default 1).' },
  { name: 'limit', type: 'integer', defaultVal: '10', description: 'Number of records per page (default 10, max 30).' },
  { name: '_sort', type: 'string', description: 'Field name to sort results by (e.g. id, name, title, createdAt).' },
  { name: '_order', type: 'string', defaultVal: 'asc', description: 'Sort direction: asc (default) or desc.' },
];

export function TryItRunner({ endpoint }: TryItRunnerProps) {
  const { refreshCounts } = useLiveCounts();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract path parameters (e.g. :id, :userId, :postId, :collection, :seed)
  const pathParamsList = useMemo(() => {
    const matches = endpoint.path.match(/:([a-zA-Z0-9_]+)/g);
    if (!matches) return [];
    return matches.map((m) => m.slice(1));
  }, [endpoint.path]);

  // Effective query parameters list
  const activeQueryParams = useMemo(() => {
    if (endpoint.queryParams && endpoint.queryParams.length > 0) {
      return endpoint.queryParams.filter((qp) => !pathParamsList.includes(qp.name));
    }
    if (endpoint.method === 'GET' && !pathParamsList.length) {
      return DEFAULT_GET_QUERY_PARAMS;
    }
    return [];
  }, [endpoint.queryParams, endpoint.method, pathParamsList]);

  // Helper for smart initial value per param
  const getSmartInitialParamVal = (param: string) => {
    const p = param.toLowerCase();
    if (p === 'collection') return 'products';
    if (p.includes('seed')) return 'Bret';
    if (p === 'template') return 'ecommerce';
    return '1';
  };

  // Input states
  const [pathValues, setPathValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    pathParamsList.forEach((param) => {
      initial[param] = getSmartInitialParamVal(param);
    });
    return initial;
  });

  const [queryValues, setQueryValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    activeQueryParams.forEach((qp) => {
      initial[qp.name] = '';
    });
    return initial;
  });

  useEffect(() => {
    const initial: Record<string, string> = {};
    pathParamsList.forEach((param) => {
      initial[param] = pathValues[param] || getSmartInitialParamVal(param);
    });
    setPathValues(initial);
  }, [endpoint.path, pathParamsList]);

  const [simulateDelay, setSimulateDelay] = useState<string>('');
  const [simulateStatus, setSimulateStatus] = useState<string>('');

  const [requestBody, setRequestBody] = useState(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : ''
  );

  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    headers: Record<string, string>;
    data: unknown;
    isSvg?: boolean;
  } | null>(null);

  // Compute constructed URL dynamically
  const computedUrl = useMemo(() => {
    let substitutedPath = endpoint.path;
    pathParamsList.forEach((param) => {
      const val = pathValues[param] || getSmartInitialParamVal(param);
      substitutedPath = substitutedPath.replace(`:${param}`, val);
    });

    const queryParts: string[] = [];
    Object.entries(queryValues).forEach(([key, val]) => {
      if (val && val.trim() !== '') {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val.trim())}`);
      }
    });

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return `${config.apiUrl}${substitutedPath}${queryString}`;
  }, [endpoint.path, pathParamsList, pathValues, queryValues]);

  const handleExecute = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
      const match = typeof document !== 'undefined' ? document.cookie.match(/pg_identity=([^;]+)/) : null;
      const cookieToken = match ? match[1] : '';
      const token = localToken || cookieToken;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['X-Playground-Identity'] = token;
      }

      if (simulateDelay.trim()) {
        headers['X-Simulate-Delay'] = simulateDelay.trim();
      }
      if (simulateStatus.trim()) {
        headers['X-Simulate-Status'] = simulateStatus.trim();
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers,
        credentials: 'include',
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(computedUrl, options);
      const timeMs = Math.round(performance.now() - startTime);

      const returnedToken = res.headers.get('x-playground-identity');
      if (returnedToken && typeof window !== 'undefined') {
        localStorage.setItem('pg_identity', returnedToken);
      }

      let data: unknown = null;
      let isSvg = false;
      const contentType = res.headers.get('content-type') || '';

      if (res.status === 204 || res.status === 205) {
        data = null;
      } else {
        const text = await res.text();
        if (contentType.includes('image/svg') || endpoint.path.includes('avatars') || endpoint.path.includes('thumbnails') || text.trim().startsWith('<svg')) {
          data = text;
          if (text.trim().startsWith('<svg')) {
            isSvg = true;
          }
        } else if (text.trim() === '') {
          data = null;
        } else {
          try {
            data = JSON.parse(text);
          } catch {
            data = text;
          }
        }
      }

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        headers: resHeaders,
        data,
        isSvg,
      });

      if (res.ok && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method)) {
        refreshCounts();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('playground:mutation'));
        }
      }
    } catch (err) {
      const timeMs = Math.round(performance.now() - startTime);
      setResponse({
        status: 0,
        statusText: 'Network Error',
        timeMs,
        headers: {},
        data: { error: String(err) },
        isSvg: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response) return;
    const textToCopy = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Collapsed View
  if (!isOpen) {
    return (
      <div className="mt-4">
        <div
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-border-theme bg-bg-secondary hover:border-emerald-500/40 p-4 flex items-center justify-between cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-500">
            <Icon icon="ph:lightning-fill" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Try it out — Test endpoint live</span>
          </div>

          <span className="text-emerald-500 hover:text-emerald-400 font-semibold text-xs sm:text-sm transition-colors">
            Test now
          </span>
        </div>
      </div>
    );
  }

  // Expanded View
  return (
    <div className="mt-4 rounded-xl border border-border-theme bg-bg-secondary p-4 sm:p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between cursor-pointer pb-2 border-b border-border-theme"
      >
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-500">
          <Icon icon="ph:lightning-fill" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          <span>Try it out — Test endpoint live</span>
        </div>
        <span className="text-emerald-500 hover:text-emerald-400 font-semibold text-xs sm:text-sm transition-colors">
          Collapse
        </span>
      </div>

      {/* Target URL Display */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-text-muted overflow-x-auto py-1">
        <span className="font-bold text-accent-primary uppercase">{endpoint.method}</span>
        <span className="text-text-primary truncate select-all">{computedUrl}</span>
      </div>

      {/* Path Parameters Inputs */}
      {pathParamsList.length > 0 && (
        <div className="space-y-3">
          {pathParamsList.map((param) => (
            <div key={param} className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-1">
                <span>{param}</span>
                <span className="text-text-muted font-normal">(path parameter):</span>
              </label>
              <input
                type="text"
                value={pathValues[param] ?? ''}
                onChange={(e) => setPathValues((prev) => ({ ...prev, [param]: e.target.value }))}
                placeholder={`Value for :${param} (e.g. ${getSmartInitialParamVal(param)})`}
                className="w-full font-mono text-xs sm:text-sm p-3 rounded-lg bg-bg-tertiary border border-border-theme text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>
          ))}
        </div>
      )}

      {/* Query Parameters Inputs */}
      {activeQueryParams.length > 0 && (
        <div className="space-y-3">
          {activeQueryParams.map((qp) => (
            <div key={qp.name} className="space-y-1">
              <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-1">
                <span>{qp.name}</span>
                <span className="text-text-muted font-normal">(query):</span>
              </label>
              <input
                type="text"
                value={queryValues[qp.name] || ''}
                onChange={(e) => setQueryValues((prev) => ({ ...prev, [qp.name]: e.target.value }))}
                placeholder={qp.description}
                className="w-full font-mono text-xs sm:text-sm p-3 rounded-lg bg-bg-tertiary border border-border-theme text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>
          ))}
        </div>
      )}

      {/* Editable Request Body if POST/PUT/PATCH */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-text-secondary">
            JSON Request Body:
          </label>
          <CodeBlock
            code={requestBody}
            language="json"
            title="Request Body (JSON)"
            maxHeight="max-h-56"
          />
        </div>
      )}

      {/* Network Simulation Headers Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-1.5">
            <Icon icon="ph:timer-bold" className="w-4 h-4 text-purple-400" />
            <span>Simulate Delay (ms):</span>
          </label>
          <input
            type="number"
            value={simulateDelay}
            onChange={(e) => setSimulateDelay(e.target.value)}
            placeholder="e.g. 1500 (0-20000ms)"
            className="w-full font-mono text-xs sm:text-sm p-3 rounded-lg bg-bg-tertiary border border-border-theme text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-1.5">
            <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-amber-400" />
            <span>Simulate Status Code:</span>
          </label>
          <input
            type="number"
            value={simulateStatus}
            onChange={(e) => setSimulateStatus(e.target.value)}
            placeholder="e.g. 500, 404, 503"
            className="w-full font-mono text-xs sm:text-sm p-3 rounded-lg bg-bg-tertiary border border-border-theme text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
          />
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Icon
            icon={loading ? 'ph:spinner-bold' : 'ph:paper-plane-right-bold'}
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          <span>{loading ? 'Executing...' : 'Execute Request'}</span>
        </button>

        <button
          onClick={() => setIsOpen(false)}
          className="text-xs sm:text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          Collapse
        </button>
      </div>

      {/* Response Inspector Display */}
      {response && (
        <div className="space-y-3 pt-3 border-t border-border-theme animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-secondary">Response Status:</span>
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-text-muted font-mono text-xs sm:text-sm">
                <Icon icon="ph:timer-bold" className="w-4 h-4 text-accent-primary" />
                <span>{response.timeMs} ms</span>
              </div>
              <button
                onClick={handleCopyResponse}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-tertiary hover:bg-border-theme text-text-secondary text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Render Live SVG Visual Preview if Response is SVG Vector */}
          {response.isSvg && typeof response.data === 'string' && (
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-semibold text-emerald-400">Live SVG Vector Render:</span>
              <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme flex items-center justify-center min-h-35 overflow-hidden">
                <div
                  className="max-w-full max-h-64 flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:shadow-lg [&>svg]:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(response.data) }}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-semibold text-text-secondary">
              {response.isSvg ? 'Raw SVG XML Code:' : 'Response Payload:'}
            </span>
            <CodeBlock
              code={response.data}
              language={response.isSvg ? 'xml' : 'json'}
              maxHeight="max-h-64"
            />
          </div>
        </div>
      )}
    </div>
  );
}
