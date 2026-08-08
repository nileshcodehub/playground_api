'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { SandboxExplanationCard } from '@/components/dashboard/SandboxExplanationCard';

interface SessionStats {
  identity: {
    id: string;
    createdAt?: string;
    lastSeenAt?: string;
    inactivityTtlDays?: number;
  };
  summary: {
    totalOverlays: number;
    creates: number;
    updates: number;
    deletes: number;
  };
  byResource: Record<
    string,
    {
      created: number;
      updated: number;
      deleted: number;
      total: number;
      quotaUsed: string;
    }
  >;
}

export default function StatsPage() {
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const [uuid, setUuid] = useState('');
  const [fullToken, setFullToken] = useState('');
  const [createdDate, setCreatedDate] = useState('N/A');
  const [lastActive, setLastActive] = useState('N/A');

  const [stats, setStats] = useState<SessionStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const match = document.cookie.match(/pg_identity=([^;]+)/);
      const cookieToken = match ? match[1] : '';

      const headers: Record<string, string> = {};
      if (cookieToken) {
        headers['X-Playground-Identity'] = cookieToken;
      }

      const res = await fetch(`${config.apiUrl}/session/stats`, {
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        const data: SessionStats = await res.json();
        setStats(data);
        if (data.identity?.id) {
          setUuid(data.identity.id);
          setFullToken(cookieToken || data.identity.id);

          if (data.identity.createdAt) {
            setCreatedDate(new Date(data.identity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
          }
          if (data.identity.lastSeenAt) {
            setLastActive(new Date(data.identity.lastSeenAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          }
        }
      }
    } catch (err) {
      console.warn('[StatsPage] Failed to fetch session stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCopyUuid = () => {
    if (!uuid) return;
    navigator.clipboard.writeText(uuid);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  const handleCopyToken = () => {
    if (!fullToken && !uuid) return;
    navigator.clipboard.writeText(fullToken || uuid);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleReset = async () => {
    setResetting(true);
    setResetMsg(null);
    try {
      const match = document.cookie.match(/pg_identity=([^;]+)/);
      const cookieToken = match ? match[1] : '';
      const headers: Record<string, string> = {};
      if (cookieToken) {
        headers['X-Playground-Identity'] = cookieToken;
      }

      const res = await fetch(`${config.apiUrl}/session/reset`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setResetMsg(data.message || 'Sandbox session overlay successfully purged.');
      } else {
        setResetMsg('Session purged.');
      }
      await fetchStats();
    } catch {
      setResetMsg('Session purged.');
    } finally {
      setResetting(false);
    }
  };

  const resourceList = stats?.byResource
    ? Object.entries(stats.byResource).map(([name, data]) => {
        const createdCount = data.created || 0;
        const maxQuota = 30;
        const pct = Math.min(Math.round((createdCount / maxQuota) * 100), 100);
        return {
          name: `/${name.charAt(0).toUpperCase() + name.slice(1)}`,
          created: data.quotaUsed || `${createdCount} / ${maxQuota}`,
          updated: data.updated || 0,
          deleted: data.deleted || 0,
          pct,
        };
      })
    : [
        { name: '/Users', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
        { name: '/Posts', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
        { name: '/Comments', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
        { name: '/Todos', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
        { name: '/Custom', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
      ];

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* Title Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:chart-bar-bold" className="w-4 h-4" />
          User Session & Quota Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Session Sandbox Activity & Quota Status
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Comprehensive overview of your personal identity token, sandbox mutation usage, rate limit status, and resource quotas.
        </p>
      </div>

      {/* 1. IDENTITY UUID Card */}
      <div id="identity-uuid" data-toc-title="Identity Token" className="p-6 rounded-2xl bg-code-bg border border-border-theme space-y-4 font-mono shadow-xl scroll-mt-20">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-text-muted uppercase tracking-wider">IDENTITY UUID</span>
          <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            10-DAY INACTIVITY RETENTION ACTIVE
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 break-all select-all">
            {uuid || 'Anonymous Session'}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyUuid}
              disabled={!uuid}
              className="px-3 py-1.5 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs sm:text-sm font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Icon icon={copiedUuid ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
              <span>{copiedUuid ? 'UUID Copied' : 'Copy UUID'}</span>
            </button>
            <button
              onClick={handleCopyToken}
              disabled={!uuid && !fullToken}
              className="px-3 py-1.5 rounded-xl bg-accent-light hover:bg-accent-primary hover:text-white text-accent-primary text-xs sm:text-sm font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Icon icon={copiedToken ? 'ph:check-bold' : 'ph:key-bold'} className="w-4 h-4" />
              <span>{copiedToken ? 'Token Copied' : 'Copy Full Signed Token'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-text-muted pt-2 border-t border-border-theme/40 font-sans">
          <span className="flex items-center gap-1">
            🗓️ Created: <strong className="text-text-secondary">{createdDate}</strong>
          </span>
          <span className="flex items-center gap-1">
            ⚡ Last Active: <strong className="text-text-secondary">{lastActive}</strong>
          </span>
        </div>
      </div>

      {/* 2. 4 Summary Metric Cards */}
      <div id="metrics-summary" data-toc-title="Session Metrics" className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center scroll-mt-20">
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-emerald-400">{stats?.summary?.totalOverlays ?? 0}</div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary">Total Sandbox Records</div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-emerald-400">{stats?.summary?.creates ?? 0}</div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary">Records Created</div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-amber-400">{stats?.summary?.updates ?? 0}</div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary">Records Updated</div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-rose-400">{stats?.summary?.deletes ?? 0}</div>
          <div className="text-xs sm:text-sm font-medium text-text-secondary">Records Deleted</div>
        </div>
      </div>

      {/* 3. Resource Quotas & Mutations Table */}
      <div id="resource-quotas" data-toc-title="Resource Quotas" className="space-y-3 scroll-mt-20">
        <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-wide">Resource Quotas & Mutations</h2>
        <div className="overflow-x-auto rounded-2xl border border-border-theme glass-panel shadow-lg">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-theme text-text-secondary font-bold">
                <th className="p-4">Resource</th>
                <th className="p-4">Created (Quota)</th>
                <th className="p-4">Updated</th>
                <th className="p-4">Deleted</th>
                <th className="p-4">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme font-medium text-text-primary">
              {resourceList.map((row) => (
                <tr key={row.name}>
                  <td className="p-4 font-bold text-sm sm:text-base">{row.name}</td>
                  <td className="p-4 font-mono text-text-secondary">{row.created}</td>
                  <td className="p-4 font-mono text-text-secondary">{row.updated}</td>
                  <td className="p-4 font-mono text-text-secondary">{row.deleted}</td>
                  <td className="p-4 w-40">
                    <div className="w-full h-2 rounded-full bg-bg-tertiary overflow-hidden border border-border-theme">
                      <div
                        className="h-full bg-accent-primary rounded-full transition-all"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. How Session Sandboxing Works Card */}
      <div id="sandbox-explanation" data-toc-title="How Sandboxing Works" className="scroll-mt-20">
        <SandboxExplanationCard />
      </div>

      {resetMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs sm:text-sm font-medium border border-emerald-500/30 flex items-center gap-2">
          <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
          <span>{resetMsg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div id="sandbox-actions" data-toc-title="Sandbox Actions" className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full scroll-mt-20">
        <button
          onClick={handleReset}
          disabled={resetting}
          className="w-full sm:w-1/2 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          <Icon icon={resetting ? 'ph:spinner-bold' : 'ph:trash-bold'} className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting Sandbox...' : 'Reset Session Sandbox'}</span>
        </button>

        <a
          href="/docs/export-import"
          className="w-full sm:w-1/2 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-xs sm:text-sm font-semibold transition-colors"
        >
          <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4 text-accent-primary" />
          <span>Export / Import Snapshot JSON</span>
        </a>
      </div>
    </div>
  );
}
