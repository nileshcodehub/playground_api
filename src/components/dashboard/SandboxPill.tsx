'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export function SandboxPill() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fullToken, setFullToken] = useState('df9ee9b9-52a7-4e7c-a325-de21989d0a85.8a7b6c5d4e3f');
  const [displayId, setDisplayId] = useState('df9ee9b9-52a7...');

  useEffect(() => {
    setMounted(true);
    // Check cookie or header fallback identity
    const match = document.cookie.match(/pg_identity=([^;]+)/);
    if (match && match[1]) {
      const raw = match[1];
      setFullToken(raw);
      if (raw.length > 16) {
        setDisplayId(raw.slice(0, 8) + '...' + raw.slice(-4));
      } else {
        setDisplayId(raw);
      }
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      suppressHydrationWarning
      className="flex items-center gap-2 bg-bg-secondary border border-border-theme px-3 py-1.5 rounded-full text-xs font-mono text-text-secondary shadow-xs"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-medium text-text-primary hidden sm:inline">Sandbox Active:</span>
      <span className="text-accent-primary font-semibold" title={fullToken} suppressHydrationWarning>
        {mounted ? displayId : 'df9ee9b9-52a7...'}
      </span>
      <button
        onClick={handleCopy}
        title="Copy Signed Identity Token"
        className="text-text-muted hover:text-text-primary transition-colors cursor-pointer ml-1"
      >
        <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
