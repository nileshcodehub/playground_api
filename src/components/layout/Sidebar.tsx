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
    <aside
      className={`w-full md:w-64 lg:w-72 shrink-0 border-r border-border-theme bg-bg-secondary p-4 transition-colors md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto ${className}`}
    >
      <div className="space-y-5">
        {siteConfig.nestedSidebarGroups.map((group) => {
          const isOpen = openGroups[group.title] !== false;

          return (
            <div key={group.title} className="space-y-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider text-sky-400 dark:text-sky-400 hover:text-sky-300 bg-bg-tertiary/50 border border-border-theme/60 hover:border-border-hover transition-all cursor-pointer group select-none"
              >
                <div className="flex items-center gap-2 truncate">
                  {group.icon && (
                    <Icon
                      icon={group.icon}
                      className="w-3.5 h-3.5 text-sky-400 dark:text-sky-400 group-hover:scale-110 transition-transform shrink-0"
                    />
                  )}
                  <span className="truncate">{group.title}</span>
                </div>
                <Icon
                  icon="ph:caret-down-bold"
                  className={`w-3 h-3 text-sky-400/80 group-hover:text-sky-300 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {/* Group Items / Submenu with tree border and indentation */}
              {isOpen && (
                <ul className="space-y-0.5 ml-3 pl-2.5 border-l border-border-theme/70 pt-0.5">
                  {group.items.map((item: { title: string; href: string; icon: string; badge?: string }) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => onSelect?.()}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                            isActive
                              ? 'bg-accent-light text-accent-primary font-semibold shadow-xs'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60 font-normal'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1.5 ${
                                isActive
                                  ? 'bg-accent-primary/20 text-accent-primary'
                                  : 'bg-bg-tertiary text-text-muted border border-border-theme'
                              }`}
                            >
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

