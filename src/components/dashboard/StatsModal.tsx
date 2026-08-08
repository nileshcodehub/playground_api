'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { SandboxExplanationCard } from './SandboxExplanationCard';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [uuid, setUuid] = useState('');
  const [fullToken, setFullToken] = useState('');
  const [createdDate, setCreatedDate] = useState('N/A');
  const [lastActive, setLastActive] = useState('N/A');
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const [stats, setStats] = useState<SessionStats | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Check cookie for token fallback
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
      console.warn('[StatsModal] Failed to fetch live session stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen, fetchStats]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-bg-secondary border border-border-theme rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-border-theme pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent-light text-accent-primary rounded-xl">
              <Icon icon="ph:chart-bar-bold" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary">Session Quota & Activity Dashboard</h3>
              <p className="text-xs sm:text-sm text-text-secondary">Sandboxed Session Stats & Mutation Quotas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors cursor-pointer"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>
        </div>

        {/* 1. IDENTITY UUID Card */}
        <div className="p-5 rounded-2xl bg-code-bg border border-border-theme space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-text-muted uppercase tracking-wider">IDENTITY UUID</span>
            <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              10-DAY INACTIVITY RETENTION ACTIVE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-lg sm:text-xl font-bold text-emerald-400 break-all select-all">
              {uuid || (loading ? 'Loading...' : 'Anonymous Session')}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyUuid}
                disabled={!uuid}
                className="px-2.5 py-1 rounded-lg bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs sm:text-sm font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                title="Copy Identity UUID"
              >
                <Icon icon={copiedUuid ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
                <span>{copiedUuid ? 'UUID Copied' : 'Copy UUID'}</span>
              </button>
              <button
                onClick={handleCopyToken}
                disabled={!uuid && !fullToken}
                className="px-2.5 py-1 rounded-lg bg-accent-light hover:bg-accent-primary hover:text-white text-accent-primary text-xs sm:text-sm font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                title="Copy Full Signed Token (<uuid>.<signature>)"
              >
                <Icon icon={copiedToken ? 'ph:check-bold' : 'ph:key-bold'} className="w-3.5 h-3.5" />
                <span>{copiedToken ? 'Token Copied' : 'Copy Token'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-text-muted pt-1 border-t border-border-theme/40 font-sans">
            <span className="flex items-center gap-1">
              🗓️ Created: <strong className="text-text-secondary">{createdDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              ⚡ Last Active: <strong className="text-text-secondary">{lastActive}</strong>
            </span>
          </div>
        </div>

        {/* 2. 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats?.summary?.totalOverlays ?? 0}</div>
            <div className="text-xs sm:text-sm font-medium text-text-secondary">Total Sandbox Records</div>
          </div>
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats?.summary?.creates ?? 0}</div>
            <div className="text-xs sm:text-sm font-medium text-text-secondary">Records Created</div>
          </div>
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats?.summary?.updates ?? 0}</div>
            <div className="text-xs sm:text-sm font-medium text-text-secondary">Records Updated</div>
          </div>
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-theme space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-rose-400">{stats?.summary?.deletes ?? 0}</div>
            <div className="text-xs sm:text-sm font-medium text-text-secondary">Records Deleted</div>
          </div>
        </div>

        {/* 3. Resource Quotas & Mutations Table */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-text-primary tracking-wide">Resource Quotas & Mutations</h4>
          <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-theme text-text-secondary font-bold">
                  <th className="p-3">Resource</th>
                  <th className="p-3">Created (Quota)</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3">Deleted</th>
                  <th className="p-3">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme font-medium text-text-primary">
                {resourceList.map((row) => (
                  <tr key={row.name}>
                    <td className="p-3 font-bold">{row.name}</td>
                    <td className="p-3 font-mono text-text-secondary">{row.created}</td>
                    <td className="p-3 font-mono text-text-secondary">{row.updated}</td>
                    <td className="p-3 font-mono text-text-secondary">{row.deleted}</td>
                    <td className="p-3 w-32">
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
        <SandboxExplanationCard />

        {resetMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs sm:text-sm font-medium border border-emerald-500/30 flex items-center gap-2">
            <Icon icon="ph:check-circle-bold" className="w-4 h-4" />
            <span>{resetMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="w-full sm:w-1/2 flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Icon icon={resetting ? 'ph:spinner-bold' : 'ph:trash-bold'} className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting Sandbox...' : 'Reset Session Sandbox'}</span>
          </button>

          <a
            href="/docs/export-import"
            onClick={onClose}
            className="w-full sm:w-1/2 flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs sm:text-sm font-semibold transition-colors"
          >
            <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4 text-accent-primary" />
            <span>Export / Import JSON</span>
          </a>
        </div>
      </div>
    </div>
  );
}

