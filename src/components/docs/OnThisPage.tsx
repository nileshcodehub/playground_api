'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface OnThisPageProps {
  className?: string;
  contentSelector?: string;
}

export function OnThisPage({ className = '', contentSelector = '#docs-content' }: OnThisPageProps) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Load saved collapse preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pg_toc_collapsed');
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pg_toc_collapsed', String(next));
      }
      return next;
    });
  };

  // Extract table of contents headings from the active documentation page
  const parseHeadings = useCallback(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const items: TocItem[] = [];
    const seenIds = new Set<string>();

    // 1. Check for top overview section or page header
    const topHeader = content.querySelector('h1');
    const overviewEl = document.getElementById('overview');
    if (topHeader || overviewEl) {
      items.push({
        id: 'overview',
        title: 'Overview',
        level: 2,
      });
      seenIds.add('overview');
    }

    // 2. Query all sections and headings inside content container
    const queryElements = content.querySelectorAll(
      'h2[id], h3[id], [data-toc-id], .scroll-mt-20[id]'
    );

    queryElements.forEach((el) => {
      const id = el.getAttribute('data-toc-id') || el.id;
      if (!id || seenIds.has(id) || id === 'overview' || id === 'docs-content') return;

      let title = el.getAttribute('data-toc-title') || '';
      if (!title) {
        const innerHeading = el.querySelector('h2, h3');
        if (innerHeading && innerHeading.textContent) {
          title = innerHeading.textContent.trim();
        } else if (el.textContent) {
          title = el.textContent.trim();
        }
      }

      if (title && title.length > 0 && title.length < 80) {
        title = title.replace(/^#\s*/, '').replace(/^[A-Z]+\s+\//, '').trim();
        const tagName = el.tagName.toLowerCase();
        const level = tagName === 'h3' ? 3 : 2;

        items.push({ id, title, level });
        seenIds.add(id);
      }
    });

    setHeadings(items);
    if (items.length > 0 && !activeId) {
      setActiveId(items[0].id);
    }
  }, [contentSelector, activeId]);

  useEffect(() => {
    const timer = setTimeout(parseHeadings, 150);
    const observer = new MutationObserver(() => parseHeadings());
    const contentNode = document.querySelector(contentSelector);
    if (contentNode) {
      observer.observe(contentNode, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname, parseHeadings, contentSelector]);

  // ScrollSpy: Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;

      if (window.scrollY < 100 && headings.length > 0) {
        setActiveId(headings[0].id);
        return;
      }

      let currentActive = headings[0]?.id || '';
      for (const item of headings) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            currentActive = item.id;
          }
        }
      }

      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveId(id);

    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "shrink-0 border-l border-border-theme bg-bg-secondary transition-all duration-300 ease-in-out xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)] xl:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isCollapsed ? "w-12 p-2.5 flex flex-col items-center select-none overflow-x-hidden" : "w-60 lg:w-64 p-5",
        className
      )}
      aria-label="Table of contents"
    >
      {isCollapsed ? (
        <div className="flex flex-col items-center space-y-4 pt-1">
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-2 rounded-lg bg-bg-tertiary hover:bg-border-theme text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
            title="Expand Table of Contents"
            aria-label="Expand Table of Contents"
          >
            <Icon icon="ph:sidebar-simple-bold" className="w-4 h-4 rotate-180 text-accent-primary" />
          </button>

          <button
            type="button"
            onClick={toggleCollapse}
            className="text-[11px] font-bold text-text-muted hover:text-text-primary tracking-widest uppercase py-2 cursor-pointer transition-colors"
            style={{ writingMode: 'vertical-rl' }}
            title="Click to expand Table of Contents"
          >
            On this page
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border-theme/40">
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:list-bullets-bold" className="w-3.5 h-3.5 text-accent-primary" />
              <span>On this page</span>
            </h4>

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
              title="Collapse Table of Contents"
              aria-label="Collapse Table of Contents"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-3.5 h-3.5" />
            </button>
          </div>

          <nav>
            <ul className="space-y-1 text-xs">
              {headings.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToHeading(item.id, e)}
                      className={cn(
                        "block py-1 px-2 rounded-md transition-colors truncate cursor-pointer",
                        item.level === 3 && "pl-4 text-text-muted text-[11px]",
                        isActive
                          ? "text-accent-primary font-bold bg-accent-light"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
                      )}
                      title={item.title}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </aside>
  );
}
