'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';

export function DocPagination() {
  const pathname = usePathname();

  const { prevPage, nextPage } = useMemo(() => {
    // Flatten all items from sidebar groups in exact sequential order
    const allPages: Array<{ title: string; href: string }> = [];
    siteConfig.nestedSidebarGroups.forEach((group) => {
      group.items.forEach((item) => {
        allPages.push({ title: item.title, href: item.href });
      });
    });

    const currentIndex = allPages.findIndex((p) => p.href === pathname);
    if (currentIndex === -1) {
      return { prevPage: null, nextPage: null };
    }

    const prev = currentIndex > 0 ? allPages[currentIndex - 1] : null;
    const next = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

    return { prevPage: prev, nextPage: next };
  }, [pathname]);

  if (!prevPage && !nextPage) {
    return null;
  }

  return (
    <div className="pt-8 mt-12 border-t border-border-theme flex items-center justify-between gap-4">
      {prevPage ? (
        <Link
          href={prevPage.href}
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
        >
          <Icon
            icon="ph:arrow-left-bold"
            className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform shrink-0"
          />
          <div className="text-left">
            <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
            <span className="truncate">{prevPage.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextPage && (
        <Link
          href={nextPage.href}
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
        >
          <div className="text-right">
            <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
            <span className="truncate">{nextPage.title}</span>
          </div>
          <Icon
            icon="ph:arrow-right-bold"
            className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform shrink-0"
          />
        </Link>
      )}
    </div>
  );
}
