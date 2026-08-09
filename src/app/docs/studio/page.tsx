'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { useLiveCounts } from '@/context/CountsContext';

const presetTemplates = [
  {
    name: 'GET /posts (List Posts)',
    method: 'GET' as const,
    path: '/posts?_limit=5&_sort=title&_order=asc',
    payload: '',
  },
  {
    name: 'POST /posts (Create Post)',
    method: 'POST' as const,
    path: '/posts',
    payload: '{\n  "title": "Interactive Studio Prototype Article",\n  "body": "Testing sandboxed POST overlay from the API Studio.",\n  "user_id": 1\n}',
  },
  {
    name: 'POST /auth/login (JWT Login)',
    method: 'POST' as const,
    path: '/auth/login',
    payload: '{\n  "username": "kminchelle",\n  "password": "password123"\n}',
  },
  {
    name: 'POST /custom/products (Create Custom Item)',
    method: 'POST' as const,
    path: '/custom/products',
    payload: '{\n  "name": "MacBook Pro M3",\n  "price": 2499,\n  "category": "Laptops"\n}',
  },
  {
    name: 'GET /avatars/Bret.svg (Avatar Image)',
    method: 'GET' as const,
    path: '/avatars/Bret.svg?size=128',
    payload: '',
  },
];

export default function StudioPage() {
  const { refreshCounts } = useLiveCounts();
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [endpointPath, setEndpointPath] = useState('/posts');
  const [simDelay, setSimDelay] = useState('0');
  const [simStatus, setSimStatus] = useState('200');
  const [jsonPayload, setJsonPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    headers: Record<string, string>;
    data: unknown;
  } | null>(null);

  const fullUrl = `${config.apiUrl}${endpointPath.startsWith('/') ? endpointPath : '/' + endpointPath}`;

  const applyTemplate = (tpl: typeof presetTemplates[0]) => {
    setMethod(tpl.method);
    setEndpointPath(tpl.path);
    if (tpl.payload) setJsonPayload(tpl.payload);
  };

  const handleSend = async () => {
    setLoading(true);
    const start = performance.now();

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

      if (simDelay !== '0') headers['X-Simulate-Delay'] = simDelay;
      if (simStatus !== '200') headers['X-Simulate-Status'] = simStatus;

      const opts: RequestInit = {
        method,
        headers,
        credentials: 'include',
        cache: 'no-cache',
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && jsonPayload) {
        opts.body = jsonPayload;
      }

      const res = await fetch(fullUrl, opts);
      const timeMs = Math.round(performance.now() - start);

      const returnedToken = res.headers.get('x-playground-identity');
      if (returnedToken && typeof window !== 'undefined') {
        localStorage.setItem('pg_identity', returnedToken);
      }

      let data: unknown = null;
      if (res.status === 204 || res.status === 205) {
        data = null;
      } else {
        const text = await res.text();
        if (text.trim() === '') {
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
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs,
        headers: resHeaders,
        data,
      });

      if (res.ok && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        refreshCounts();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('playground:mutation'));
        }
      }
    } catch (err) {
      const timeMs = Math.round(performance.now() - start);
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
    <div className="space-y-10 w-full max-w-none">
      {/* Title Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
          Interactive API Studio & Request Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Interactive Request Builder & Response Inspector
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          The API Studio is an in-browser request tester. Use it to prototype API queries, inspect JSON payloads, test network latency delays, simulate HTTP error codes, and verify your session identity overlays in real time.
        </p>
      </div>

      {/* What this section is used for */}
      <div id="how-to-use" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3 scroll-mt-20">
        <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:info-bold" className="w-5 h-5 text-accent-primary" />
          How to Use the Interactive API Studio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-text-secondary">
          <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme space-y-1">
            <div className="font-bold text-text-primary text-sm">1. Choose or Build Request</div>
            <p className="leading-relaxed">Select HTTP method (GET, POST, PUT, PATCH, DELETE) or pick a preset template below.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme space-y-1">
            <div className="font-bold text-text-primary text-sm">2. Test Middleware Simulation</div>
            <p className="leading-relaxed">Add artificial network latency (e.g. 1500ms) or force 500 error status codes to test UI spinners.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme space-y-1">
            <div className="font-bold text-text-primary text-sm">3. Inspect Response Metrics</div>
            <p className="leading-relaxed">View exact HTTP status codes, execution latency in milliseconds, headers, and formatted JSON output.</p>
          </div>
        </div>
      </div>

      {/* Preset Quick Templates */}
      <div id="preset-templates" data-toc-title="Preset Templates" className="space-y-2 scroll-mt-20">
        <span className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider">Preset Request Templates:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {presetTemplates.map((tpl) => (
            <button
              key={tpl.name}
              onClick={() => applyTemplate(tpl)}
              className="px-3 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-semibold text-text-primary shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon="ph:magic-wand-bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-primary" />
              <span>{tpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Form */}
      <div id="request-builder" data-toc-title="Request Builder" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-6 shadow-xl scroll-mt-20">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full sm:w-32 font-mono text-xs sm:text-sm font-bold p-3 rounded-xl bg-bg-tertiary border border-border-theme text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <div className="flex-1 w-full flex items-center bg-bg-secondary border border-border-theme rounded-xl overflow-hidden px-3">
            <span className="font-mono text-xs sm:text-sm text-text-muted shrink-0">{config.publicApiUrl || config.apiUrl}</span>

            <input
              type="text"
              value={endpointPath}
              onChange={(e) => setEndpointPath(e.target.value)}
              className="w-full font-mono text-xs sm:text-sm text-text-primary bg-transparent p-3 focus:outline-none"
              placeholder="/posts?_limit=5"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Icon icon={loading ? 'ph:spinner-bold' : 'ph:paper-plane-right-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Sending...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Network Middleware Simulation Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-theme">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-1.5">
              <Icon icon="ph:clock-afternoon-bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              Simulate Delay Header (X-Simulate-Delay):
            </label>
            <select
              value={simDelay}
              onChange={(e) => setSimDelay(e.target.value)}
              className="w-full font-mono text-xs sm:text-sm p-2.5 rounded-lg bg-bg-tertiary border border-border-theme text-text-primary focus:outline-none"
            >
              <option value="0">0 ms (Instant)</option>
              <option value="500">500 ms (Fast)</option>
              <option value="1500">1500 ms (Medium)</option>
              <option value="3000">3000 ms (Slow)</option>
              <option value="5000">5000 ms (High Latency)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-semibold text-text-secondary flex items-center gap-1.5">
              <Icon icon="ph:warning-circle-bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
              Simulate Status Code (X-Simulate-Status):
            </label>
            <select
              value={simStatus}
              onChange={(e) => setSimStatus(e.target.value)}
              className="w-full font-mono text-xs sm:text-sm p-2.5 rounded-lg bg-bg-tertiary border border-border-theme text-text-primary focus:outline-none"
            >
              <option value="200">200 OK (Normal)</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="404">404 Not Found</option>
              <option value="500">500 Server Error</option>
            </select>
          </div>
        </div>

        {/* Payload Body Editor */}
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="space-y-2 pt-2 border-t border-border-theme">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-text-secondary">Request Body Payload (JSON):</label>
              <span className="text-[11px] text-accent-primary font-mono font-medium">Editable Payload</span>
            </div>
            <CodeBlock
              code={jsonPayload}
              language="json"
              title="Payload (JSON)"
              maxHeight="max-h-60"
              editable={true}
              onChange={(val) => setJsonPayload(val)}
              placeholder="{\n  &quot;title&quot;: &quot;Custom item&quot;\n}"
            />
          </div>
        )}

        {/* Response Viewer */}
        {response && (
          <div className="space-y-4 pt-4 border-t border-border-theme animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg ${
                    response.status >= 200 && response.status < 300
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {response.status} {response.statusText}
                </span>
                <span className="font-mono text-xs sm:text-sm text-text-muted flex items-center gap-1">
                  <Icon icon="ph:timer-bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {response.timeMs} ms execution
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">Response Payload Output</span>
              <CodeBlock
                code={response.data}
                language={typeof response.data === 'string' && response.data.startsWith('<svg') ? 'svg' : 'json'}
                maxHeight="max-h-96"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
