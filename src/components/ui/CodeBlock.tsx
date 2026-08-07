'use client';

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export interface CodeBlockTab {
  id: string;
  label?: string;
  code: unknown;
  icon?: string;
  language?: string;
}

export interface CodeBlockProps {
  code?: unknown;
  snippets?: Record<string, unknown>;
  tabs?: CodeBlockTab[];
  defaultTab?: string;
  language?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  copyable?: boolean;
  maxHeight?: string;
  className?: string;
  codeClassName?: string;
  showHeader?: boolean;
  onTabChange?: (tabId: string) => void;
}

const LANGUAGE_ICONS: Record<string, string> = {
  javascript: 'simple-icons:javascript',
  node: 'simple-icons:nodedotjs',
  axios: 'simple-icons:axios',
  python: 'simple-icons:python',
  curl: 'ph:terminal-window-bold',
  bash: 'ph:terminal-window-bold',
  sh: 'ph:terminal-window-bold',
  go: 'simple-icons:go',
  swift: 'simple-icons:swift',
  kotlin: 'simple-icons:kotlin',
  rust: 'simple-icons:rust',
  php: 'simple-icons:php',
  json: 'ph:brackets-curly-bold',
  graphql: 'simple-icons:graphql',
  xml: 'ph:code-bold',
  svg: 'ph:sparkle-bold',
  typescript: 'simple-icons:typescript',
};

export function CodeBlock({
  code,
  snippets,
  tabs: customTabs,
  defaultTab,
  language,
  title,
  subtitle,
  icon,
  copyable = true,
  maxHeight = 'max-h-64',
  className,
  codeClassName,
  showHeader,
  onTabChange,
}: CodeBlockProps) {
  // Normalize tabs from customTabs, snippets, or single code
  const tabs: CodeBlockTab[] = useMemo(() => {
    if (customTabs && customTabs.length > 0) {
      return customTabs;
    }
    if (snippets && Object.keys(snippets).length > 0) {
      return Object.entries(snippets).map(([key, val]) => {
        const langKey = key.toLowerCase();
        return {
          id: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          code: val,
          icon: LANGUAGE_ICONS[langKey] || 'ph:code-bold',
          language: langKey,
        };
      });
    }
    return [];
  }, [customTabs, snippets]);

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (defaultTab && tabs.some((t) => t.id === defaultTab)) {
      return defaultTab;
    }
    return tabs[0]?.id || '';
  });

  const [copied, setCopied] = useState(false);

  // Determine current active code
  const currentRawCode = useMemo(() => {
    if (tabs.length > 0) {
      const found = tabs.find((t) => t.id === activeTabId) || tabs[0];
      return found?.code;
    }
    return code;
  }, [tabs, activeTabId, code]);

  // Format code to display string
  const formattedCode = useMemo(() => {
    if (currentRawCode === null || currentRawCode === undefined) return '';
    if (typeof currentRawCode === 'string') return currentRawCode;
    try {
      return JSON.stringify(currentRawCode, null, 2);
    } catch {
      return String(currentRawCode);
    }
  }, [currentRawCode]);

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleCopy = () => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasTabs = tabs.length > 0;
  const shouldRenderHeader = showHeader ?? Boolean(hasTabs || title || subtitle || language);

  return (
    <div className={cn('rounded-xl border border-border-theme bg-code-bg overflow-hidden shadow-xs group', className)}>
      {/* Header Bar: Either Multi-tab Bar or Single Code Info Header */}
      {shouldRenderHeader && (
        <div className="flex items-center justify-between bg-bg-tertiary px-3.5 py-1.5 border-b border-border-theme text-xs font-mono overflow-x-auto gap-2">
          {hasTabs ? (
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const tabIcon = tab.icon || LANGUAGE_ICONS[tab.id.toLowerCase()];

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors cursor-pointer shrink-0',
                      isActive
                        ? 'bg-accent-primary text-white font-bold shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    )}
                  >
                    {tabIcon && <Icon icon={tabIcon} className="w-3.5 h-3.5 shrink-0" />}
                    <span>{tab.label || tab.id}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-text-secondary truncate">
              {icon && <Icon icon={icon} className="w-4 h-4 text-accent-primary shrink-0" />}
              {title && <span className="font-bold text-text-primary truncate">{title}</span>}
              {language && !title && (
                <span className="text-[11px] font-bold text-accent-primary uppercase tracking-wider">
                  {language}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0 ml-auto">
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

      {/* Code Viewer Container */}
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
