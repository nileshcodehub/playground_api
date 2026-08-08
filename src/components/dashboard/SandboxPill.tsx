'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export function SandboxPill() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fullToken, setFullToken] = useState('');
  const [displayId, setDisplayId] = useState('Active');

  useEffect(() => {
    setMounted(true);
    const updateIdentity = (raw: string) => {
      setFullToken(raw);
      if (raw.length > 16) {
        setDisplayId(raw.slice(0, 8) + '...' + raw.slice(-4));
      } else {
        setDisplayId(raw);
      }
    };

    // 1. Check cookie
    const match = document.cookie.match(/pg_identity=([^;]+)/);
    if (match && match[1]) {
      updateIdentity(match[1]);
    } else {
      // 2. Fetch backend root/stats to initialize/retrieve identity cookie
      fetch(`${config.apiUrl}/session/stats`, { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.identity?.id) {
            const reMatch = document.cookie.match(/pg_identity=([^;]+)/);
            if (reMatch && reMatch[1]) {
              updateIdentity(reMatch[1]);
            } else {
              updateIdentity(data.identity.id);
            }
          }
        })
        .catch(() => {
          // Fallback to active state if backend request fails
          setDisplayId('Active');
        });
    }
  }, []);

  const handleCopy = () => {
    if (!fullToken) return;
    navigator.clipboard.writeText(fullToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      suppressHydrationWarning
      className="flex items-center gap-2 bg-bg-secondary border border-border-theme px-3 py-1.5 rounded-full text-xs sm:text-sm font-mono text-text-secondary shadow-xs"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-medium text-text-primary hidden sm:inline">Sandbox Active:</span>
      <span className="text-accent-primary font-semibold" title={fullToken || displayId} suppressHydrationWarning>
        {mounted ? displayId : 'Active'}
      </span>
      {fullToken && (
        <button
          onClick={handleCopy}
          title="Copy Signed Identity Token"
          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer ml-1"
        >
          <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
}

