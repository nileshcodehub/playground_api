'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { EndpointDef, QueryParamDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useLiveCounts } from '@/context/CountsContext';
import { cn } from '@/lib/utils';
import config from '@/config/env';

interface TryItRunnerProps {
  endpoint: EndpointDef;
  defaultExpanded?: boolean;
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
  { name: 'limit', type: 'integer', defaultVal: '10', description: 'Number of records per page (default 10, max 200).' },
  { name: '_sort', type: 'string', description: 'Field name to sort results by (e.g. id, name, title, createdAt).' },
  { name: '_order', type: 'string', defaultVal: 'asc', description: 'Sort direction: asc (default) or desc.' },
];

export function TryItRunner({ endpoint, defaultExpanded = false }: TryItRunnerProps) {
  const { refreshCounts } = useLiveCounts();
  const [isOpen, setIsOpen] = useState(defaultExpanded);
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

  // Simulation Controls
  const [simulateDelay, setSimulateDelay] = useState<string>('0');
  const [simulateStatus, setSimulateStatus] = useState<string>('200');

  // Auth Bearer Token state
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('pg_access_token') || '';
      if (savedToken) setAuthToken(savedToken);
    }
  }, []);

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
    isPersistedMutation?: boolean;
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

    if (simulateDelay !== '0' && simulateDelay !== '') {
      queryParts.push(`_delay=${encodeURIComponent(simulateDelay)}`);
    }
    if (simulateStatus !== '200' && simulateStatus !== '') {
      queryParts.push(`_status=${encodeURIComponent(simulateStatus)}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return `${config.apiUrl}${substitutedPath}${queryString}`;
  }, [endpoint.path, pathParamsList, pathValues, queryValues, simulateDelay, simulateStatus]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Validate Path Parameters
    pathParamsList.forEach((param) => {
      const val = (pathValues[param] ?? '').trim();
      if (!val) {
        errors[`path_${param}`] = `Parameter :${param} is required`;
      }
    });

    // 2. Validate Query Parameters
    Object.entries(queryValues).forEach(([key, rawVal]) => {
      const val = (rawVal || '').trim();
      if (!val) return; // Optional when empty

      if (key === 'page') {
        if (!/^\d+$/.test(val) || parseInt(val, 10) < 1) {
          errors[`query_${key}`] = 'Page must be a positive integer >= 1';
        }
      } else if (key === 'limit') {
        if (!/^\d+$/.test(val) || parseInt(val, 10) < 1 || parseInt(val, 10) > 200) {
          errors[`query_${key}`] = 'Limit must be an integer between 1 and 200';
        }
      } else if (key === '_order') {
        const lower = val.toLowerCase();
        if (lower !== 'asc' && lower !== 'desc') {
          errors[`query_${key}`] = "Order must be 'asc' or 'desc'";
        }
      } else if (key === 'completed') {
        const lower = val.toLowerCase();
        if (lower !== 'true' && lower !== 'false') {
          errors[`query_${key}`] = "Must be 'true' or 'false'";
        }
      } else if (key.endsWith('_id') || key === 'user_id' || key === 'post_id') {
        if (!val.startsWith('local-') && !/^-?\d+$/.test(val)) {
          errors[`query_${key}`] = 'Must be a valid integer ID';
        }
      }
    });

    // 3. Validate JSON payload on POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBody.trim()) {
      try {
        JSON.parse(requestBody);
      } catch (err: any) {
        errors['body'] = `Invalid JSON payload: ${err.message}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExecute = async () => {
    if (!validateForm()) {
      return;
    }

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

      if (authToken.trim()) {
        headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
      }

      if (simulateDelay !== '0' && simulateDelay.trim() !== '') {
        headers['X-Simulate-Delay'] = simulateDelay.trim();
      }
      if (simulateStatus !== '200' && simulateStatus.trim() !== '') {
        headers['X-Simulate-Status'] = simulateStatus.trim();
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers,
        credentials: 'include',
        cache: 'no-cache',
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
        if (
          contentType.includes('image/svg') ||
          endpoint.path.includes('avatars') ||
          endpoint.path.includes('thumbnails') ||
          text.trim().startsWith('<svg')
        ) {
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

      // If auth token was returned, save it
      if (data && typeof data === 'object') {
        const anyData = data as Record<string, any>;
        if (anyData.accessToken) {
          setAuthToken(anyData.accessToken);
          if (typeof window !== 'undefined') localStorage.setItem('pg_access_token', anyData.accessToken);
        } else if (anyData.token) {
          setAuthToken(anyData.token);
          if (typeof window !== 'undefined') localStorage.setItem('pg_access_token', anyData.token);
        }
      }

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      const isPersistedMutation =
        res.ok && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(endpoint.method);

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        headers: resHeaders,
        data,
        isSvg,
        isPersistedMutation,
      });

      if (isPersistedMutation) {
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
        isPersistedMutation: false,
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
      <div className="mt-2">
        <div
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 p-4 flex items-center justify-between cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm text-emerald-400">
            <Icon icon="ph:lightning-fill" className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Try it out — Test endpoint live with simulation controls</span>
          </div>

          <span className="text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1">
            <span>Open Console</span>
            <Icon icon="ph:caret-down-bold" className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  }

  // Expanded View
  return (
    <div className="rounded-xl border border-border-theme bg-bg-secondary p-4 sm:p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
      {/* 1. Header & Target URL Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-theme">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold">
            {endpoint.method}
          </span>
          <span className="font-mono text-xs sm:text-sm text-text-primary truncate select-all">
            {computedUrl}
          </span>
        </div>

        {!defaultExpanded && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-text-muted hover:text-text-primary self-end sm:self-auto cursor-pointer"
          >
            Collapse
          </button>
        )}
      </div>

      {/* 2. Path Parameters */}
      {pathParamsList.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Path Parameters
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pathParamsList.map((param) => {
              const hasError = Boolean(formErrors[`path_${param}`]);
              return (
                <div key={param} className="space-y-1">
                  <div className="text-[11px] font-mono text-text-muted">:{param}</div>
                  <input
                    type="text"
                    value={pathValues[param] ?? ''}
                    onChange={(e) => {
                      setPathValues((prev) => ({ ...prev, [param]: e.target.value }));
                      if (formErrors[`path_${param}`]) {
                        setFormErrors((prev) => {
                          const next = { ...prev };
                          delete next[`path_${param}`];
                          return next;
                        });
                      }
                    }}
                    placeholder={`Value for :${param}`}
                    className={cn(
                      "w-full font-mono text-xs p-2.5 rounded-lg bg-bg-tertiary border text-text-primary focus:outline-none transition-colors",
                      hasError
                        ? "border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30"
                        : "border-border-theme focus:border-accent-primary"
                    )}
                  />
                  {hasError && (
                    <div className="text-[11px] text-rose-400 flex items-center gap-1 font-sans animate-in fade-in duration-150">
                      <Icon icon="ph:warning-circle-fill" className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors[`path_${param}`]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Query Parameters */}
      {activeQueryParams.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Query Filters & Options
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeQueryParams.map((qp) => {
              const hasError = Boolean(formErrors[`query_${qp.name}`]);
              const isPageOrLimit = qp.name === 'page' || qp.name === '_page' || qp.name === 'limit' || qp.name === '_limit';
              const isLimit = qp.name === 'limit' || qp.name === '_limit';
              const isOrder = qp.name === '_order';
              const isSort = qp.name === '_sort';

              // Dynamic sort fields based on current resource endpoint
              const sortOptions = (() => {
                const p = endpoint.path.toLowerCase();
                if (p.includes('user')) return ['id', 'name', 'username', 'email'];
                if (p.includes('post')) return ['id', 'title', 'user_id'];
                if (p.includes('comment')) return ['id', 'name', 'email', 'post_id'];
                if (p.includes('todo')) return ['id', 'title', 'user_id', 'completed'];
                return ['id', 'title', 'name', 'username', 'email', 'user_id'];
              })();

              const handleValueChange = (val: string) => {
                setQueryValues((prev) => ({ ...prev, [qp.name]: val }));
                if (formErrors[`query_${qp.name}`]) {
                  setFormErrors((prev) => {
                    const next = { ...prev };
                    delete next[`query_${qp.name}`];
                    return next;
                  });
                }
              };

              return (
                <div key={qp.name} className="space-y-1">
                  <div className="text-[11px] font-mono text-text-muted">{qp.name}</div>
                  
                  {isOrder ? (
                    <select
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      className={cn(
                        "w-full font-mono text-xs p-2.5 rounded-lg bg-bg-tertiary border text-text-primary focus:outline-none transition-colors cursor-pointer",
                        hasError
                          ? "border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30"
                          : "border-border-theme focus:border-accent-primary"
                      )}
                    >
                      <option value="">Default: asc</option>
                      <option value="asc">asc (Ascending)</option>
                      <option value="desc">desc (Descending)</option>
                    </select>
                  ) : isSort ? (
                    <select
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      className={cn(
                        "w-full font-mono text-xs p-2.5 rounded-lg bg-bg-tertiary border text-text-primary focus:outline-none transition-colors cursor-pointer",
                        hasError
                          ? "border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30"
                          : "border-border-theme focus:border-accent-primary"
                      )}
                    >
                      <option value="">Default: id</option>
                      {sortOptions.map((field) => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                  ) : isPageOrLimit ? (
                    <input
                      type="number"
                      min={1}
                      max={isLimit ? 200 : undefined}
                      step={1}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder={qp.defaultVal ? `Default: ${qp.defaultVal}` : qp.description}
                      className={cn(
                        "w-full font-mono text-xs p-2.5 rounded-lg bg-bg-tertiary border text-text-primary focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        hasError
                          ? "border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30"
                          : "border-border-theme focus:border-accent-primary"
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      value={queryValues[qp.name] || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder={qp.defaultVal ? `Default: ${qp.defaultVal}` : qp.description}
                      className={cn(
                        "w-full font-mono text-xs p-2.5 rounded-lg bg-bg-tertiary border text-text-primary focus:outline-none transition-colors",
                        hasError
                          ? "border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30"
                          : "border-border-theme focus:border-accent-primary"
                      )}
                    />
                  )}

                  {hasError && (
                    <div className="text-[11px] text-rose-400 flex items-center gap-1 font-sans animate-in fade-in duration-150">
                      <Icon icon="ph:warning-circle-fill" className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors[`query_${qp.name}`]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Auth Bearer Token input if relevant */}
      {(endpoint.path.includes('/auth') || endpoint.id.includes('auth')) && (
        <div className="space-y-1.5 p-3 rounded-xl bg-bg-tertiary/60 border border-border-theme">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:lock-key-bold" className="w-4 h-4 text-amber-400" />
              Authorization Bearer Token (Simulated JWT):
            </span>
            <span className="text-[11px] text-text-muted">Auto-captured from /auth/login</span>
          </div>
          <input
            type="text"
            value={authToken}
            onChange={(e) => {
              setAuthToken(e.target.value);
              if (typeof window !== 'undefined') localStorage.setItem('pg_access_token', e.target.value);
            }}
            placeholder="Paste JWT Access Token or test /auth/login to auto-populate"
            className="w-full font-mono text-xs p-2 rounded-lg bg-bg-secondary border border-border-theme text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>
      )}

      {/* 5. Request Body (JSON) */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Request Payload (Editable JSON)
            </label>
            <span className="text-[11px] text-text-muted font-mono">application/json</span>
          </div>
          <CodeBlock
            code={requestBody}
            language="json"
            title="Request Payload"
            maxHeight="max-h-52"
            editable={true}
            onChange={(newVal) => {
              setRequestBody(newVal);
              if (formErrors['body']) {
                setFormErrors((prev) => {
                  const next = { ...prev };
                  delete next['body'];
                  return next;
                });
              }
            }}
          />
          {formErrors['body'] && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-sans animate-in fade-in duration-150">
              <Icon icon="ph:warning-circle-fill" className="w-4 h-4 shrink-0" />
              <span>{formErrors['body']}</span>
            </div>
          )}
        </div>
      )}

      {/* 6. Network Latency & Status Simulation Controls */}
      <div className="p-3.5 rounded-xl bg-bg-tertiary/40 border border-border-theme space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Icon icon="ph:gear-six-bold" className="w-4 h-4 text-purple-400" />
            Network & Chaos Simulation Tools
          </span>
          <span className="text-[11px] text-text-muted font-mono">Header / Query Flag</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Delay selector */}
          <div className="space-y-1.5">
            <div className="text-xs text-text-secondary flex items-center justify-between">
              <span>Simulated Latency:</span>
              <span className="font-mono text-purple-400 font-bold">{simulateDelay} ms</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '0ms', val: '0' },
                { label: '500ms', val: '500' },
                { label: '1.5s', val: '1500' },
                { label: '3s', val: '3000' },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => setSimulateDelay(d.val)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    simulateDelay === d.val
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-bg-tertiary hover:bg-border-theme text-text-secondary'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status override */}
          <div className="space-y-1.5">
            <div className="text-xs text-text-secondary flex items-center justify-between">
              <span>Simulated HTTP Status:</span>
              <span className="font-mono text-amber-400 font-bold">{simulateStatus}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[
                { label: '200', val: '200' },
                { label: '400', val: '400' },
                { label: '401', val: '401' },
                { label: '404', val: '404' },
                { label: '500', val: '500' },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => setSimulateStatus(s.val)}
                  className={`px-1.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                    simulateStatus === s.val
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-bg-tertiary hover:bg-border-theme text-text-secondary'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Action Button */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Icon
            icon={loading ? 'ph:spinner-bold' : 'ph:paper-plane-right-bold'}
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          <span>{loading ? 'Sending Request...' : 'Send Live Request'}</span>
        </button>

        <span className="text-[11px] text-text-muted font-mono">
          Identity: Isolated Session Overlay
        </span>
      </div>

      {/* 8. Response Display */}
      {response && (
        <div className="space-y-3 pt-3 border-t border-border-theme animate-in fade-in duration-200">
          {/* Response Meta Header */}
          <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-secondary">Status:</span>
              <span
                className={`font-mono font-bold px-2.5 py-0.5 rounded-md ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {response.status} {response.statusText}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-text-muted font-mono text-xs">
                <Icon icon="ph:timer-bold" className="w-3.5 h-3.5 text-accent-primary" />
                <span>{response.timeMs} ms</span>
              </div>
            </div>
          </div>

          {/* Mutation Persistence Success Notice */}
          {response.isPersistedMutation && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <Icon icon="ph:sparkle-fill" className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Mutation Persisted in Sandbox:</strong> This change is saved in your private session overlay. Fetching list endpoints will immediately reflect this item.
              </span>
            </div>
          )}

          {/* Render Live SVG Visual Preview if Response is SVG Vector */}
          {response.isSvg && typeof response.data === 'string' && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400">Live Rendered SVG Vector:</span>
              <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme flex items-center justify-center min-h-36 overflow-hidden">
                <div
                  className="max-w-full max-h-64 flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:shadow-lg [&>svg]:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(response.data) }}
                />
              </div>
            </div>
          )}

          {/* Response Payload Code Block */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary">
              {response.isSvg ? 'Raw Vector XML:' : 'Response Payload (JSON):'}
            </span>
            <CodeBlock
              code={response.data}
              language={response.isSvg ? 'xml' : 'json'}
              maxHeight="max-h-72"
            />
          </div>
        </div>
      )}
    </div>
  );
}
