'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function SandboxPage() {
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [uuid, setUuid] = useState('');
  const [signedToken, setSignedToken] = useState('');

  useEffect(() => {
    const updateToken = (raw: string) => {
      setSignedToken(raw);
      setUuid(raw.split('.')[0]);
    };

    const match = document.cookie.match(/pg_identity=([^;]+)/);
    if (match && match[1]) {
      updateToken(match[1]);
    } else {
      fetch(`${config.apiUrl}/session/stats`, { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.identity?.id) {
            const reMatch = document.cookie.match(/pg_identity=([^;]+)/);
            if (reMatch && reMatch[1]) {
              updateToken(reMatch[1]);
            } else {
              updateToken(data.identity.id);
            }
          }
        })
        .catch((err) => {
          console.warn('[SandboxPage] Failed to fetch live session token:', err);
        });
    }
  }, []);

  const handleCopyUuid = () => {
    if (!uuid) return;
    navigator.clipboard.writeText(uuid);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  const handleCopyToken = () => {
    if (!signedToken && !uuid) return;
    navigator.clipboard.writeText(signedToken || uuid);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-10 w-full max-w-none">
      <div className="space-y-3 border-b border-border-theme pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:key-bold" className="w-4 h-4" />
          Session Architecture & Security
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Option B HMAC Signed Identity & Sandboxing
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Detailed guide on how Playground API authenticates anonymous visitors, manages persistent session overlays, and enforces IP auto-recovery.
        </p>
      </div>

      {/* Live Active Identity Token Box */}
      <div className="p-6 rounded-2xl bg-code-bg border border-border-theme space-y-4 font-mono shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Icon icon="ph:key-bold" className="w-4 h-4" />
            Your Live Session Signed Token Format
          </span>
          <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-accent-light text-accent-primary border border-accent-primary/20">
            HMAC-SHA256 Signed
          </span>
        </div>

        <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-2">
          <div className="text-xs sm:text-sm text-text-muted">Format: &lt;UUID&gt;.&lt;HMAC_SIGNATURE&gt;</div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 break-all select-all">
            {signedToken || uuid || 'Active Session Token'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyUuid}
            disabled={!uuid}
            className="px-4 py-2 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-primary text-xs sm:text-sm font-sans font-semibold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Icon icon={copiedUuid ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-emerald-400" />
            <span>{copiedUuid ? 'UUID Copied!' : 'Copy UUID Only'}</span>
          </button>
          <button
            onClick={handleCopyToken}
            disabled={!signedToken && !uuid}
            className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-sans font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Icon icon={copiedToken ? 'ph:check-bold' : 'ph:key-bold'} className="w-4 h-4" />
            <span>{copiedToken ? 'Signed Token Copied!' : 'Copy Signed Token (<uuid>.<sig>)'}</span>
          </button>
        </div>
      </div>

      {/* Detailed Architectural Pillars */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Icon icon="ph:cookie-bold" className="w-5 h-5 text-amber-400" />
            1. Cookie & Header Transport Mechanism
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            The backend sets the <code className="font-mono text-accent-primary">pg_identity</code> HTTP cookie automatically. For cross-origin E2E test suites (Playwright, Cypress) or mobile applications where cookies are restricted, pass the header explicitly:
          </p>
          <div className="p-3.5 rounded-xl bg-code-bg font-mono text-xs sm:text-sm text-emerald-400 border border-border-theme select-all">
            X-Playground-Identity: {signedToken || uuid || '<your_signed_token>'}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Icon icon="ph:shield-warning-bold" className="w-5 h-5 text-indigo-400" />
            2. IP Auto-Recovery Fallback
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            If a client tampers with the HMAC signature or clears cookies, Playground API hashes the client IP address (using salted SHA-256) and automatically recovers the visitor&apos;s previous identity session without throwing breaking errors.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
            <Icon icon="ph:tree-structure-bold" className="w-5 h-5 text-pink-400" />
            3. Virtual Overlay Ordering Rules
          </h2>
          <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
            <li><strong>Creates:</strong> Newly created sandbox items receive string IDs like <code className="font-mono text-accent-primary">local-&lt;uuid&gt;</code> and are prepended to the top of list queries.</li>
            <li><strong>Updates:</strong> Modified items retain their exact index position within virtual lists.</li>
            <li><strong>Deletes:</strong> Deleted record IDs are filtered out of ID list slices prior to pagination.</li>
            <li><strong>10-Day Purge:</strong> Sessions idle for 10 consecutive days are automatically purged via background cron jobs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

