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

    // 2. Query all sections, endpoint cards, and headings inside content container
    const queryElements = content.querySelectorAll(
      'h2[id], h3[id], [data-toc-id], .scroll-mt-20[id], [id^="get-"], [id^="post-"], [id^="put-"], [id^="patch-"], [id^="delete-"]'
    );

    queryElements.forEach((el) => {
      const id = el.getAttribute('data-toc-id') || el.id;
      if (!id || seenIds.has(id) || id === 'overview' || id === 'docs-content') return;

      // Extract human-readable title
      let title = el.getAttribute('data-toc-title') || '';
      if (!title) {
        // If element contains an h2 or h3 inside (e.g. EndpointCard)
        const innerHeading = el.querySelector('h2, h3');
        if (innerHeading && innerHeading.textContent) {
          title = innerHeading.textContent.trim();
        } else if (el.textContent) {
          title = el.textContent.trim();
        }
      }

      // Filter out overly long text or empty titles
      if (title && title.length > 0 && title.length < 80) {
        // Clean up common badge prefixes or hashtags
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

  // Re-scan headings on pathname change & DOM mutations
  useEffect(() => {
    // Initial parse after a short delay for dynamic rendering
    const timer = setTimeout(parseHeadings, 150);

    const observer = new MutationObserver(() => {
      parseHeadings();
    });

    const contentNode = document.querySelector(contentSelector);
    if (contentNode) {
      observer.observe(contentNode, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname, parseHeadings, contentSelector]);

  // ScrollSpy: Track active heading on user scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;

      // If at the very top of the page, activate the first item (Overview)
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
      className={`w-64 lg:w-72 shrink-0 border-l border-border-theme bg-bg-secondary p-5 transition-colors xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)] xl:overflow-y-auto ${className}`}
      aria-label="Table of contents"
    >
      <div className="space-y-4">
        {/* TOC Section Header Title */}
        <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs">
          On this page
        </h4>

        {/* Headings Navigation List */}
        <nav className="relative">
          <ul className="space-y-1 text-xs sm:text-sm font-medium border-l border-border-theme ml-1 pl-2">
            {headings.map((item) => {
              const isActive = activeId === item.id;

              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`block py-1.5 px-2.5 rounded-lg transition-all truncate text-xs sm:text-sm cursor-pointer ${
                      item.level === 3 ? 'pl-5 text-xs text-text-muted' : ''
                    } ${
                      isActive
                        ? 'text-accent-primary font-bold bg-accent-light/30 border-l-2 border-accent-primary -ml-2.25 pl-4 shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
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
