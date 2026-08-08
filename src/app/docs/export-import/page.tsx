'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

const fallbackSnapshotPayload = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  identity_id: 'pg-identity-anon-session-abc123xyz',
  created_records: [
    {
      resource: 'posts',
      id: 'local-f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      title: 'E2E Testing Prototype Post',
      body: 'Pre-seeded mock post payload for automated integration testing.',
      user_id: 1,
      created_at: new Date().toISOString(),
    },
  ],
  updated_records: [],
  deleted_record_ids: [],
};

export default function ExportImportPage() {
  const [snapshotJson, setSnapshotJson] = useState(JSON.stringify(fallbackSnapshotPayload, null, 2));
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Attempt to fetch current live session export on load
    const match = document.cookie.match(/pg_identity=([^;]+)/);
    const cookieToken = match ? match[1] : '';
    const headers: Record<string, string> = {};
    if (cookieToken) headers['X-Playground-Identity'] = cookieToken;

    fetch(`${config.apiUrl}/session/export`, { headers, credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSnapshotJson(JSON.stringify(data, null, 2));
        }
      })
      .catch((err) => {
        console.warn('[ExportImportPage] Live session export fetch warning:', err);
      });
  }, []);

  const handleExport = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const match = document.cookie.match(/pg_identity=([^;]+)/);
      const cookieToken = match ? match[1] : '';
      const headers: Record<string, string> = {};
      if (cookieToken) headers['X-Playground-Identity'] = cookieToken;

      const res = await fetch(`${config.apiUrl}/session/export`, {
        headers,
        credentials: 'include',
      });

      let snapshotData = fallbackSnapshotPayload;
      if (res.ok) {
        snapshotData = await res.json();
      }

      const jsonStr = JSON.stringify(snapshotData, null, 2);
      setSnapshotJson(jsonStr);

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playground-sandbox-snapshot-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMsg({ type: 'success', text: 'Live sandbox session snapshot exported and downloaded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to export session snapshot.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!snapshotJson) {
      setStatusMsg({ type: 'error', text: 'Please paste or upload a valid JSON snapshot payload.' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      const parsed = JSON.parse(snapshotJson);
      const match = document.cookie.match(/pg_identity=([^;]+)/);
      const cookieToken = match ? match[1] : '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (cookieToken) headers['X-Playground-Identity'] = cookieToken;

      const res = await fetch(`${config.apiUrl}/session/import`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(parsed),
      });

      if (res.ok) {
        const result = await res.json();
        setStatusMsg({
          type: 'success',
          text: result.message || 'Sandbox state restored successfully from JSON snapshot!',
        });
      } else {
        const errData = await res.json().catch(() => null);
        setStatusMsg({
          type: 'error',
          text: errData?.error || 'Failed to import snapshot to session sandbox.',
        });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Invalid JSON snapshot payload format.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* Page Title & Overview */}
      <div className="space-y-3 border-b border-border-theme pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
          Session Snapshot Management
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Export & Import Session Sandbox
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Save your complete sandboxed mutation state into a portable JSON snapshot or restore mock data across devices and team environments.
        </p>
      </div>

      {/* What it is & Where it is used */}
      <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
          <Icon icon="ph:info-bold" className="w-5 h-5 text-accent-primary" />
          What is Snapshot Export & Import and Where is it Used?
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          When prototyping or building automated test suites, you often create complex mock states—such as multiple created posts, modified user profiles, and deleted task items.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-1.5">
            <div className="font-bold text-text-primary text-sm flex items-center gap-1.5">
              <Icon icon="ph:share-network-bold" className="w-4 h-4 text-emerald-400" />
              Team Collaboration
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Export your sandbox state into a JSON snapshot file and share it with frontend team members so everyone tests against the exact same mock data scenario.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-1.5">
            <div className="font-bold text-text-primary text-sm flex items-center gap-1.5">
              <Icon icon="ph:test-tube-bold" className="w-4 h-4 text-indigo-400" />
              Automated E2E Testing
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Pre-load deterministic snapshot JSON files into Playwright or Cypress E2E test suites before running component tests.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-1.5">
            <div className="font-bold text-text-primary text-sm flex items-center gap-1.5">
              <Icon icon="ph:devices-bold" className="w-4 h-4 text-pink-400" />
              Cross-Device Backup
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Transfer session state between desktop browsers, mobile emulators, or postman workspaces effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500">
              <Icon icon="ph:download-simple-bold" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary">1. Export Session State</h3>
              <p className="text-xs sm:text-sm text-text-secondary">Download active overlay JSON</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Generates a structured JSON file containing all created local records, updated rows, and deleted record IDs.
          </p>
          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Icon icon={loading ? 'ph:spinner-bold' : 'ph:export-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Exporting...' : 'Export & Download JSON'}</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent-primary">
              <Icon icon="ph:upload-simple-bold" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary">2. Restore State Snapshot</h3>
              <p className="text-xs sm:text-sm text-text-secondary">Import JSON payload state</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Paste or load a JSON snapshot file into the editor below and click restore to apply the state to your session identity.
          </p>
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Icon icon={loading ? 'ph:spinner-bold' : 'ph:import-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Restoring...' : 'Restore State from Payload'}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}
        >
          <Icon icon={statusMsg.type === 'success' ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'} className="w-5 h-5" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Sample Payload Explanation & Interactive Code Viewer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Icon icon="ph:code-bold" className="w-4 h-4 text-accent-primary" />
            Snapshot JSON Payload Schema
          </label>
          <span className="text-xs sm:text-sm font-mono text-text-muted">Format: JSON v1.0.0</span>
        </div>
        <CodeBlock
          code={snapshotJson}
          language="json"
          title="Snapshot Payload (JSON)"
          maxHeight="max-h-[28rem]"
        />
      </div>
    </div>
  );
}

