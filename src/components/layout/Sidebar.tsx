'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';

interface SidebarProps {
  onSelect?: () => void;
  className?: string;
}

export function Sidebar({ onSelect, className = '' }: SidebarProps) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Getting Started': true,
    'Features & Sandbox Tools': true,
    'REST API Collections': true,
    'GraphQL API Gateway': true,
    'API Downloads & Specs': true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className={`w-full md:w-64 lg:w-68 shrink-0 border-r border-border-theme bg-bg-secondary p-4 space-y-6 transition-colors md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto ${className}`}>
      <div className="space-y-5">
        {siteConfig.nestedSidebarGroups.map((group) => {
          const isOpen = openGroups[group.title] !== false;

          return (
            <div key={group.title} className="space-y-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <span>{group.title}</span>
                <Icon
                  icon="ph:caret-down-bold"
                  className={`w-3 h-3 text-text-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {/* Group Items */}
              {isOpen && (
                <ul className="space-y-0.5 pt-1">
                  {group.items.map((item: { title: string; href: string; icon: string; badge?: string }) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => onSelect?.()}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-accent-light text-accent-primary font-bold'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-bg-tertiary text-text-muted border border-border-theme font-mono">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
