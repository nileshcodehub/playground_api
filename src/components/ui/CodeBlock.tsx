'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import styles from './CodeBlock.module.css';

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
  showLineNumbers?: boolean;
  oddEvenZebra?: boolean;
  initialWrap?: boolean;
  highlightedLines?: number[];
  onTabChange?: (tabId: string) => void;
  editable?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const LANGUAGE_ICONS: Record<string, string> = {
  javascript: 'simple-icons:javascript',
  js: 'simple-icons:javascript',
  node: 'simple-icons:nodedotjs',
  axios: 'simple-icons:axios',
  python: 'simple-icons:python',
  py: 'simple-icons:python',
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
  gql: 'simple-icons:graphql',
  xml: 'ph:code-bold',
  svg: 'ph:sparkle-bold',
  typescript: 'simple-icons:typescript',
  ts: 'simple-icons:typescript',
};

/**
 * Intelligent Syntax Tokenizer for JSON, JS/TS, Python, cURL, GraphQL, Go, Rust, Swift, PHP
 */
function tokenizeLine(line: string) {
  if (!line || line.trim() === '') {
    return [{ text: line || ' ', type: 'plain' }];
  }

  // 1. Check for single-line comments (//, #, --)
  const commentMatch = line.match(/^(\s*)((\/\/|#|--).*)$/);
  if (commentMatch) {
    return [
      { text: commentMatch[1], type: 'whitespace' },
      { text: commentMatch[2], type: 'comment' },
    ];
  }

  // 2. Tokenize line with regex rules
  const tokens: { text: string; type: string }[] = [];
  const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[a-zA-Z0-9_-]+`|\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b|\b(?:import|export|from|const|let|var|function|return|async|await|class|def|func|fn|struct|package|query|mutation|type|interface|val|fun|pub|use|new|try|catch|throw|if|else|switch|case|default|while|for)\b|\b(?:true|false|null|nil|None|undefined)\b|\b\d+(?:\.\d+)?\b|[{}\[\](),:;]|\/\/.*$|#.*$|[^\s"'`{}\[\](),:;]+|\s+)/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const raw = match[0];

    if (/^\s+$/.test(raw)) {
      tokens.push({ text: raw, type: 'whitespace' });
    } else if (raw.startsWith('//') || raw.startsWith('#')) {
      tokens.push({ text: raw, type: 'comment' });
    } else if (/^"(?:\\.|[^"\\])*"$/.test(raw)) {
      // Check if it is a JSON object key (followed by colon)
      const afterMatch = line.slice(regex.lastIndex).trimStart();
      if (afterMatch.startsWith(':')) {
        tokens.push({ text: raw, type: 'key' });
      } else {
        tokens.push({ text: raw, type: 'string' });
      }
    } else if (/^'(?:\\.|[^'\\])*'$/.test(raw)) {
      tokens.push({ text: raw, type: 'string' });
    } else if (/^\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b$/.test(raw)) {
      tokens.push({ text: raw, type: 'http-method' });
    } else if (/^\b(?:import|export|from|const|let|var|function|return|async|await|class|def|func|fn|struct|package|query|mutation|type|interface|val|fun|pub|use|new|try|catch|throw|if|else|switch|case|default|while|for)\b$/.test(raw)) {
      tokens.push({ text: raw, type: 'keyword' });
    } else if (/^\b(?:true|false|null|nil|None|undefined)\b$/.test(raw)) {
      tokens.push({ text: raw, type: 'boolean' });
    } else if (/^\b\d+(?:\.\d+)?\b$/.test(raw)) {
      tokens.push({ text: raw, type: 'number' });
    } else if (/^[{}()[\]]$/.test(raw)) {
      tokens.push({ text: raw, type: 'bracket' });
    } else if (/^[,:;]$/.test(raw)) {
      tokens.push({ text: raw, type: 'punct' });
    } else {
      tokens.push({ text: raw, type: 'plain' });
    }
  }

  return tokens.length > 0 ? tokens : [{ text: line, type: 'plain' }];
}

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
  maxHeight = 'max-h-96',
  className,
  codeClassName,
  showHeader,
  showLineNumbers: initialShowLineNumbers = true,
  oddEvenZebra = true,
  initialWrap = false,
  highlightedLines = [],
  onTabChange,
  editable = false,
  onChange,
  placeholder,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

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
  const [showLineNumbers, setShowLineNumbers] = useState(initialShowLineNumbers);
  const [wrapLines, setWrapLines] = useState(initialWrap);
  const highlightedLinesSet = useMemo(() => new Set(highlightedLines), [highlightedLines]);
  const [activeLineNumber, setActiveLineNumber] = useState(1);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [formatSuccess, setFormatSuccess] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLineClick = useCallback((lineNum: number) => {
    if (editable) return;
    setActiveLine((prev) => (prev === lineNum ? null : lineNum));
  }, [editable]);

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

  // Split into lines
  const lines = useMemo(() => {
    return formattedCode ? formattedCode.split('\n') : [''];
  }, [formattedCode]);

  // JSON Validation Check for JSON code
  const jsonStatus = useMemo(() => {
    if ((language === 'json' || title?.toLowerCase().includes('json')) && formattedCode.trim() !== '') {
      try {
        JSON.parse(formattedCode);
        return { valid: true, error: null };
      } catch (err: any) {
        return { valid: false, error: err.message };
      }
    }
    return null;
  }, [language, title, formattedCode]);

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleCopy = useCallback(() => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedCode]);

  // Format JSON Action
  const handleFormatJson = () => {
    if (!formattedCode.trim()) return;
    try {
      const parsed = JSON.parse(formattedCode);
      const formatted = JSON.stringify(parsed, null, 2);
      if (onChange) {
        onChange(formatted);
      }
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 1500);
    } catch {
      // Ignore if invalid
    }
  };

  // Cursor tracking to highlight active row in editor mode
  const updateCursorLine = (el: HTMLTextAreaElement) => {
    const cursorIndex = el.selectionStart;
    const textBeforeCursor = el.value.substring(0, cursorIndex);
    const lineNumber = textBeforeCursor.split('\n').length;
    setActiveLineNumber(lineNumber);
  };

  const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    updateCursorLine(e.currentTarget);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    updateCursorLine(e.target);
  };

  // Handle Tab key in Textarea for 2 spaces indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updated = formattedCode.substring(0, start) + '  ' + formattedCode.substring(end);
      if (onChange) {
        onChange(updated);
      }

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          updateCursorLine(textareaRef.current);
        }
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = e.currentTarget.scrollTop;
      textareaRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleTextareaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = e.currentTarget.scrollTop;
      wrapperRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const hasTabs = tabs.length > 0;
  const shouldRenderHeader = showHeader ?? Boolean(hasTabs || title || subtitle || language || copyable || editable);

  // Render Token using modular CSS classes
  const renderToken = (token: { text: string; type: string }, idx: number) => {
    switch (token.type) {
      case 'key':
        return <span key={idx} className={styles.tokenKey}>{token.text}</span>;
      case 'string':
        return <span key={idx} className={styles.tokenString}>{token.text}</span>;
      case 'number':
        return <span key={idx} className={styles.tokenNumber}>{token.text}</span>;
      case 'boolean':
        return <span key={idx} className={styles.tokenBoolean}>{token.text}</span>;
      case 'keyword':
        return <span key={idx} className={styles.tokenKeyword}>{token.text}</span>;
      case 'http-method':
        return <span key={idx} className={styles.tokenMethod}>{token.text}</span>;
      case 'comment':
        return <span key={idx} className={styles.tokenComment}>{token.text}</span>;
      case 'bracket':
        return <span key={idx} className={styles.tokenBracket}>{token.text}</span>;
      case 'punct':
        return <span key={idx} className={styles.tokenPunct}>{token.text}</span>;
      default:
        return <span key={idx} className={styles.tokenPlain}>{token.text}</span>;
    }
  };

  return (
    <div
      className={cn(
        styles.container,
        isDark ? styles.dark : styles.light,
        className
      )}
    >
      {/* Header Bar: Multi-tab Switcher, Metadata, and Controls */}
      {shouldRenderHeader && (
        <div className={styles.header}>
          {hasTabs ? (
            <div className={styles.tabList}>
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const tabIcon = tab.icon || LANGUAGE_ICONS[tab.id.toLowerCase()];

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={cn(
                      styles.tabItem,
                      isActive && styles.tabItemActive
                    )}
                  >
                    {tabIcon && <Icon icon={tabIcon} className="w-3.5 h-3.5 shrink-0" />}
                    <span>{tab.label || tab.id}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.metaInfo}>
              {icon && <Icon icon={icon} className="w-4 h-4 text-accent-primary shrink-0" />}
              {title && <span className={styles.metaTitle}>{title}</span>}
              {language && !title && (
                <span className={styles.metaLanguage}>
                  {language}
                </span>
              )}
              {editable && (
                <span className={styles.editableBadge}>
                  <Icon icon="ph:pencil-simple-line-bold" className="w-3 h-3" />
                  Editable
                </span>
              )}
            </div>
          )}

          {/* Action Toolbar */}
          <div className={styles.actions}>
            {subtitle && (
              <span className={cn(styles.metaSubtitle, 'hidden sm:inline')}>
                {subtitle}
              </span>
            )}

            {/* Prettify / Format JSON Button (Only in editable mode) */}
            {editable && (language === 'json' || title?.toLowerCase().includes('json')) && (
              <button
                type="button"
                onClick={handleFormatJson}
                className={styles.formatBtn}
                title="Format & Prettify JSON (2 spaces)"
              >
                <Icon icon={formatSuccess ? 'ph:check-bold' : 'ph:sparkle-bold'} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{formatSuccess ? 'Formatted' : 'Format'}</span>
              </button>
            )}

            {/* Line Numbers Toggle */}
            <button
              type="button"
              onClick={() => setShowLineNumbers((prev) => !prev)}
              className={cn(
                styles.actionBtn,
                showLineNumbers && styles.actionBtnActive
              )}
              title={showLineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers'}
            >
              <Icon icon="ph:list-numbers-bold" className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{lines.length}L</span>
            </button>

            {/* Wrap Toggle */}
            <button
              type="button"
              onClick={() => setWrapLines((prev) => !prev)}
              className={cn(
                styles.actionBtn,
                wrapLines && styles.actionBtnActive
              )}
              title={wrapLines ? 'Disable Line Wrap' : 'Enable Line Wrap'}
            >
              <Icon icon={wrapLines ? 'ph:text-align-left-bold' : 'ph:text-align-justify-bold'} className="w-3.5 h-3.5" />
            </button>

            {/* Copy Button */}
            {copyable && (
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  styles.copyBtn,
                  copied && styles.copyBtnCopied
                )}
                title="Copy code snippet"
              >
                <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Area: Editable Editor Mode OR Syntax Highlighted Display Mode */}
      {editable ? (
        <div className="relative font-mono text-xs sm:text-sm">
          <div
            ref={wrapperRef}
            onScroll={handleScroll}
            className={cn(
              styles.editorWrapper,
              wrapLines && styles.editorWrapperWrapped,
              maxHeight,
              codeClassName
            )}
          >
            {/* Visual Background Layer: Zebra Striping + Token Highlighting + Line Numbers + Active Line */}
            <div
              className={cn(
                styles.editorLayerBackground,
                wrapLines && styles.editorLayerBackgroundWrapped
              )}
            >
              {lines.map((line, index) => {
                const lineNum = index + 1;
                const isOdd = index % 2 === 0;
                const isActiveLine = lineNum === activeLineNumber;
                const isHighlighted = highlightedLinesSet.has(lineNum);
                const tokens = tokenizeLine(line);

                return (
                  <div
                    key={index}
                    className={cn(
                      styles.lineRow,
                      wrapLines && styles.lineRowWrapped,
                      oddEvenZebra && (isOdd ? styles.oddLine : styles.evenLine),
                      isActiveLine && styles.activeLineHighlight,
                      isHighlighted && styles.pinnedLine
                    )}
                  >
                    {/* Line Number Gutter */}
                    {showLineNumbers && (
                      <div
                        className={cn(
                          styles.lineGutter,
                          (isActiveLine || isHighlighted) && styles.lineGutterPinned
                        )}
                      >
                        {lineNum}
                      </div>
                    )}

                    {/* Line Content */}
                    <div
                      className={cn(
                        styles.lineContent,
                        wrapLines && styles.lineWrapped
                      )}
                    >
                      {tokens.map((token, tIdx) => renderToken(token, tIdx))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Foreground Overlay Textarea: Captures Keystrokes, Caret & Scrolling */}
            <textarea
              ref={textareaRef}
              value={formattedCode}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleCursorMove}
              onClick={handleCursorMove}
              onSelect={handleCursorMove}
              onScroll={handleTextareaScroll}
              placeholder={placeholder || '{\n  "key": "value"\n}'}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className={cn(
                styles.editorLayerTextarea,
                showLineNumbers ? styles.editorLayerTextareaWithGutter : styles.editorLayerTextareaNoGutter,
                wrapLines && styles.lineWrapped
              )}
            />
          </div>

          {/* Validation Status Footer */}
          {jsonStatus && (
            <div className="px-3 py-1.5 border-t border-border-theme/40 bg-bg-secondary/60 flex items-center justify-between text-[11px]">
              {jsonStatus.valid ? (
                <span className={styles.jsonStatusValid}>
                  <Icon icon="ph:check-circle-fill" className="w-3.5 h-3.5 text-emerald-400" />
                  Valid JSON Payload
                </span>
              ) : (
                <span className={styles.jsonStatusInvalid}>
                  <Icon icon="ph:warning-circle-fill" className="w-3.5 h-3.5 text-rose-400" />
                  Invalid JSON: {jsonStatus.error}
                </span>
              )}
              <span className="text-text-muted">Press Tab to indent</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative font-mono text-xs sm:text-sm">
          {!shouldRenderHeader && copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className={styles.floatingCopyBtn}
              title="Copy code snippet"
            >
              <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-accent-primary" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}

          <div
            className={cn(
              styles.codeViewport,
              wrapLines && styles.codeViewportWrapped,
              maxHeight,
              codeClassName
            )}
          >
            <div
              className={cn(
                styles.linesWrapper,
                wrapLines && styles.linesWrapperWrapped
              )}
            >
              {lines.map((line, index) => {
                const lineNum = index + 1;
                const isOdd = index % 2 === 0;
                const isLineActive = activeLine === lineNum;
                const isHighlighted = highlightedLinesSet.has(lineNum) || isLineActive;
                const tokens = tokenizeLine(line);

                return (
                  <div
                    key={index}
                    onClick={() => handleLineClick(lineNum)}
                    className={cn(
                      styles.lineRow,
                      wrapLines && styles.lineRowWrapped,
                      oddEvenZebra && (isOdd ? styles.oddLine : styles.evenLine),
                      isHighlighted && styles.pinnedLine
                    )}
                  >
                    {/* Line Number Gutter */}
                    {showLineNumbers && (
                      <div
                        className={cn(
                          styles.lineGutter,
                          isHighlighted && styles.lineGutterPinned
                        )}
                      >
                        {lineNum}
                      </div>
                    )}

                    {/* Line Content */}
                    <div
                      className={cn(
                        styles.lineContent,
                        wrapLines && styles.lineWrapped
                      )}
                    >
                      {tokens.map((token, tIdx) => renderToken(token, tIdx))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
