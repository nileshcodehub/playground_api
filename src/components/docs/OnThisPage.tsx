'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

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
      className={`w-60 lg:w-64 shrink-0 border-l border-border-theme bg-bg-secondary p-5 transition-colors xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)] xl:overflow-y-auto ${className}`}
      aria-label="Table of contents"
    >
      <div className="space-y-3">
        <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">
          On this page
        </h4>

        <nav>
          <ul className="space-y-1 text-xs">
            {headings.map((item) => {
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`block py-1 px-2 rounded-md transition-colors truncate cursor-pointer ${
                      item.level === 3 ? 'pl-4 text-text-muted' : ''
                    } ${
                      isActive
                        ? 'text-accent-primary font-bold bg-accent-light'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
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
    </aside>
  );
}
