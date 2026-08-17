'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { useLiveCounts } from '@/context/CountsContext';

const scenarioCategories = [
  {
    category: '1. CRUD Lifecycle Demo',
    scenarios: [
      {
        name: 'Step 1: Create Post (POST)',
        method: 'POST' as const,
        path: '/posts',
        payload: '{\n  "title": "My Interactive Studio Article",\n  "body": "Testing sandboxed POST overlay from the API Studio.",\n  "user_id": 1\n}',
      },
      {
        name: 'Step 2: List Posts (GET)',
        method: 'GET' as const,
        path: '/posts?_limit=5',
        payload: '',
      },
      {
        name: 'Step 3: Edit Post (PATCH)',
        method: 'PATCH' as const,
        path: '/posts/1',
        payload: '{\n  "title": "Patched Title from Studio"\n}',
      },
      {
        name: 'Step 4: Reset Sandbox (DELETE)',
        method: 'DELETE' as const,
        path: '/session/reset',
        payload: '',
      },
    ],
  },
  {
    category: '2. Latency & Error Simulation',
    scenarios: [
      {
        name: 'Simulate Slow 3G (1.5s Delay)',
        method: 'GET' as const,
        path: '/posts?_limit=3',
        delay: '1500',
        status: '200',
        payload: '',
      },
      {
        name: 'Simulate 500 Server Error',
        method: 'GET' as const,
        path: '/posts?_status=500',
        delay: '0',
        status: '500',
        payload: '',
      },
      {
        name: 'Simulate 404 Not Found',
        method: 'GET' as const,
        path: '/users/9999?_status=404',
        delay: '0',
        status: '404',
        payload: '',
      },
    ],
  },
  {
    category: '3. JWT Authentication Flow',
    scenarios: [
      {
        name: 'Login as Bret (POST /auth/login)',
        method: 'POST' as const,
        path: '/auth/login',
        payload: '{\n  "username": "Bret",\n  "password": "password123"\n}',
      },
      {
        name: 'Get Current Profile (GET /auth/me)',
        method: 'GET' as const,
        path: '/auth/me',
        payload: '',
      },
      {
        name: 'Refresh Token (POST /auth/refresh)',
        method: 'POST' as const,
        path: '/auth/refresh',
        payload: '{\n  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."\n}',
      },
    ],
  },
  {
    category: '4. Dynamic Custom Collections',
    scenarios: [
      {
        name: 'Seed E-Commerce Template',
        method: 'POST' as const,
        path: '/custom/seed?template=ecommerce',
        payload: '{\n  "template": "ecommerce"\n}',
      },
      {
        name: 'List Products (GET)',
        method: 'GET' as const,
        path: '/custom/products',
        payload: '',
      },
      {
        name: 'Create Custom Product (POST)',
        method: 'POST' as const,
        path: '/custom/products',
        payload: '{\n  "name": "MacBook Pro M3 Max",\n  "price": 3499,\n  "category": "Laptops"\n}',
      },
      {
        name: 'Generate Avatar SVG (GET)',
        method: 'GET' as const,
        path: '/avatars/Bret.svg?size=128',
        payload: '',
      },
    ],
  },
];

export default function StudioPage() {
  const { refreshCounts } = useLiveCounts();
  const [activeCategory, setActiveCategory] = useState(0);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [endpointPath, setEndpointPath] = useState('/posts?_limit=5');
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

  const applyScenario = (sc: any) => {
    setMethod(sc.method);
    setEndpointPath(sc.path);
    setJsonPayload(sc.payload || '');
    if (sc.delay !== undefined) setSimDelay(sc.delay);
    if (sc.status !== undefined) setSimStatus(sc.status);
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

      if (typeof window !== 'undefined') {
        const savedAuth = localStorage.getItem('pg_access_token');
        if (savedAuth && endpointPath.includes('/auth/me')) {
          headers['Authorization'] = `Bearer ${savedAuth}`;
        }
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

      // If token returned, store it
      if (data && typeof data === 'object') {
        const anyData = data as Record<string, any>;
        if (anyData.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('pg_access_token', anyData.accessToken);
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
      {/* 1. Title Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
          Interactive API Studio & Scenario Presets
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Interactive API Studio
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Test stateful CRUD operations, simulate network conditions, and verify your isolated session overlay in real time.
        </p>
      </div>

      {/* 2. Guided Scenario Presets */}
      <div id="scenario-presets" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4 shadow-xl scroll-mt-20">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <Icon icon="ph:sparkle-bold" className="w-4 h-4 text-accent-primary" />
            Guided Workflow Scenarios
          </h2>
          <span className="text-xs text-text-muted">1-Click presets</span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border-theme/70">
          {scenarioCategories.map((cat, idx) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeCategory === idx
                  ? 'bg-accent-primary text-white shadow-xs'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Scenario Buttons in Active Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {scenarioCategories[activeCategory].scenarios.map((sc) => (
            <button
              key={sc.name}
              onClick={() => applyScenario(sc)}
              className="p-3 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-left transition-all cursor-pointer group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-accent-light text-accent-primary">
                  {sc.method}
                </span>
                <Icon icon="ph:arrow-elbow-down-right-bold" className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-primary transition-colors" />
              </div>
              <div className="font-bold text-xs text-text-primary">{sc.name}</div>
              <div className="font-mono text-[11px] text-text-muted truncate">{sc.path}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Request Form */}
      <div id="request-builder" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-6 shadow-xl scroll-mt-20">
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

        {/* Latency & Status Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-theme">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Icon icon="ph:timer-bold" className="w-4 h-4 text-purple-400" />
              <span>Simulate Latency Delay (ms):</span>
            </label>
            <div className="flex items-center gap-2">
              {['0', '500', '1500', '3000'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSimDelay(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    simDelay === d ? 'bg-purple-600 text-white' : 'bg-bg-tertiary text-text-secondary hover:bg-border-theme'
                  }`}
                >
                  {d === '0' ? '0ms' : `${d}ms`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-amber-400" />
              <span>Simulate HTTP Status Code:</span>
            </label>
            <div className="flex items-center gap-2">
              {['200', '400', '401', '404', '500'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSimStatus(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    simStatus === s ? 'bg-amber-600 text-white' : 'bg-bg-tertiary text-text-secondary hover:bg-border-theme'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* JSON Request Body if applicable */}
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="space-y-1.5 pt-2 border-t border-border-theme">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                JSON Request Body Payload:
              </label>
              <span className="text-xs text-text-muted font-mono">application/json</span>
            </div>
            <CodeBlock
              code={jsonPayload}
              language="json"
              title="Request Payload"
              maxHeight="max-h-60"
              editable={true}
              onChange={(v) => setJsonPayload(v)}
            />
          </div>
        )}
      </div>

      {/* 4. Response Output */}
      {response && (
        <div id="response-output" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4 shadow-xl scroll-mt-20 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border-theme">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-text-secondary">Response Status:</span>
              <span
                className={`font-mono text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {response.status} {response.statusText}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs text-text-muted">
              <Icon icon="ph:timer-bold" className="w-4 h-4 text-accent-primary" />
              <span>Latency: {response.timeMs} ms</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Response Body (JSON):
            </span>
            <CodeBlock
              code={response.data}
              language="json"
              title="Studio Response Output"
              maxHeight="max-h-96"
            />
          </div>
        </div>
      )}
    </div>
  );
}
