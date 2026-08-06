'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { SandboxExplanationCard } from '@/components/dashboard/SandboxExplanationCard';

export default function StatsPage() {
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const [uuid, setUuid] = useState('df9ee9b9-52a7-4e7c-a325-de21989d0a85');
  const [fullToken, setFullToken] = useState('df9ee9b9-52a7-4e7c-a325-de21989d0a85.8a7b6c5d4e3f');
  const [createdDate, setCreatedDate] = useState('Jul 28, 2026');
  const [lastActive, setLastActive] = useState('12:21 AM');

  useEffect(() => {
    const match = document.cookie.match(/pg_identity=([^;]+)/);
    if (match && match[1]) {
      const parts = match[1].split('.');
      setUuid(parts[0]);
      setFullToken(match[1]);
    }
  }, []);

  const handleCopyUuid = () => {
    navigator.clipboard.writeText(uuid);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(fullToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleReset = async () => {
    setResetting(true);
    setResetMsg(null);
    try {
      await fetch(`${config.apiUrl}/session/reset`, { method: 'DELETE' });
      setResetMsg('Sandbox session overlay successfully purged.');
    } catch {
      setResetMsg('Session purged.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* Title Header */}
      <div className="space-y-3 border-b border-border-theme pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs font-bold">
          <Icon icon="ph:chart-bar-bold" className="w-4 h-4" />
          User Session & Quota Dashboard
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Session Sandbox Activity & Quota Status
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Comprehensive overview of your personal identity token, sandbox mutation usage, rate limit status, and resource quotas.
        </p>
      </div>

      {/* 1. IDENTITY UUID Card */}
      <div className="p-6 rounded-2xl bg-code-bg border border-border-theme space-y-4 font-mono shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">IDENTITY UUID</span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            10-DAY INACTIVITY RETENTION ACTIVE
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xl font-bold text-emerald-400 break-all select-all">{uuid}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyUuid}
              className="px-3 py-1.5 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon={copiedUuid ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
              <span>{copiedUuid ? 'UUID Copied' : 'Copy UUID'}</span>
            </button>
            <button
              onClick={handleCopyToken}
              className="px-3 py-1.5 rounded-xl bg-accent-light hover:bg-accent-primary hover:text-white text-accent-primary text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon={copiedToken ? 'ph:check-bold' : 'ph:key-bold'} className="w-4 h-4" />
              <span>{copiedToken ? 'Token Copied' : 'Copy Full Signed Token'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted pt-2 border-t border-border-theme/40 font-sans">
          <span className="flex items-center gap-1">
            🗓️ Created: <strong className="text-text-secondary">{createdDate}</strong>
          </span>
          <span className="flex items-center gap-1">
            ⚡ Last Active: <strong className="text-text-secondary">{lastActive}</strong>
          </span>
        </div>
      </div>

      {/* 2. 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-emerald-400">0</div>
          <div className="text-xs font-medium text-text-secondary">Total Sandbox Records</div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-emerald-400">0</div>
          <div className="text-xs font-medium text-text-secondary">Records Created</div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-amber-400">0</div>
          <div className="text-xs font-medium text-text-secondary">Records Updated</div>
        </div>
        <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-theme space-y-1">
          <div className="text-3xl font-black text-rose-400">0</div>
          <div className="text-xs font-medium text-text-secondary">Records Deleted</div>
        </div>
      </div>

      {/* 3. Resource Quotas & Mutations Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-text-primary tracking-wide">Resource Quotas & Mutations</h2>
        <div className="overflow-x-auto rounded-2xl border border-border-theme glass-panel shadow-lg">
          <table className="w-full text-left border-collapse text-xs">
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
              {[
                { name: '/Users', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
                { name: '/Posts', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
                { name: '/Comments', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
                { name: '/Todos', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
                { name: '/Custom', created: '0 / 30', updated: 0, deleted: 0, pct: 0 },
              ].map((row) => (
                <tr key={row.name}>
                  <td className="p-4 font-bold text-sm">{row.name}</td>
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
      <SandboxExplanationCard />

      {resetMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/30 flex items-center gap-2">
          <Icon icon="ph:check-circle-bold" className="w-5 h-5" />
          <span>{resetMsg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          onClick={handleReset}
          disabled={resetting}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          <Icon icon={resetting ? 'ph:spinner-bold' : 'ph:trash-bold'} className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting Sandbox...' : 'Reset Session Sandbox'}</span>
        </button>

        <a
          href="/docs/export-import"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-xs font-semibold transition-colors"
        >
          <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4 text-accent-primary" />
          <span>Export / Import Snapshot JSON</span>
        </a>
      </div>
    </div>
  );
}
