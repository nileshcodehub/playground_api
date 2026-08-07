'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: unknown;
  language?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  copyable?: boolean;
  maxHeight?: string;
  className?: string;
  codeClassName?: string;
  showHeader?: boolean;
}

export function CodeBlock({
  code,
  language,
  title,
  subtitle,
  icon,
  copyable = true,
  maxHeight = 'max-h-64',
  className,
  codeClassName,
  showHeader,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Normalize code content to formatted string
  const formattedCode = React.useMemo(() => {
    if (code === null || code === undefined) return '';
    if (typeof code === 'string') return code;
    try {
      return JSON.stringify(code, null, 2);
    } catch {
      return String(code);
    }
  }, [code]);

  const handleCopy = () => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldRenderHeader = showHeader ?? Boolean(title || subtitle || language);

  return (
    <div className={cn('rounded-xl border border-border-theme bg-code-bg overflow-hidden shadow-sm group', className)}>
      {/* Optional Code Header Bar */}
      {shouldRenderHeader && (
        <div className="flex items-center justify-between bg-bg-tertiary px-3.5 py-2 border-b border-border-theme text-xs font-mono">
          <div className="flex items-center gap-2 text-text-secondary truncate">
            {icon && <Icon icon={icon} className="w-4 h-4 text-accent-primary shrink-0" />}
            {title && <span className="font-bold text-text-primary truncate">{title}</span>}
            {language && !title && (
              <span className="text-[11px] font-bold text-accent-primary uppercase tracking-wider">
                {language}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-2">
            {subtitle && <span className="text-emerald-400 font-semibold text-[11px] select-all truncate">{subtitle}</span>}
            {copyable && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-bg-secondary hover:bg-border-theme text-text-secondary hover:text-text-primary text-[11px] font-medium transition-colors cursor-pointer"
                title="Copy code snippet"
              >
                <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Container */}
      <div className="relative">
        {!shouldRenderHeader && copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-bg-tertiary/90 hover:bg-border-theme text-text-secondary hover:text-text-primary text-[11px] font-mono font-medium transition-all opacity-70 group-hover:opacity-100 backdrop-blur-xs cursor-pointer border border-border-theme/60"
            title="Copy code snippet"
          >
            <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}

        <pre className={cn('p-4 font-mono text-xs text-gray-200 overflow-x-auto leading-relaxed', maxHeight, codeClassName)}>
          <code>{formattedCode}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
