'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onSelect?: () => void;
  className?: string;
}

export function Sidebar({ onSelect, className = '' }: SidebarProps) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Load initial collapsed preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pg_sidebar_collapsed');
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pg_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

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
      className={cn(
        "shrink-0 border-r border-border-theme bg-bg-secondary transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isCollapsed
          ? "w-16 p-2 flex flex-col items-center select-none overflow-x-hidden"
          : "w-full md:w-64 lg:w-72 p-4",
        className
      )}
      aria-label="Documentation Navigation"
    >
      {isCollapsed ? (
        /* Collapsed Icon-Only View with Tooltips */
        <div className="w-full flex flex-col items-center space-y-3 pt-1">
          {/* Expand Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="w-10 h-10 rounded-xl bg-bg-tertiary hover:bg-border-theme text-text-secondary hover:text-accent-primary flex items-center justify-center transition-colors cursor-pointer"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <Icon icon="ph:sidebar-simple-bold" className="w-4 h-4 text-accent-primary" />
          </button>

          <div className="w-8 h-px bg-border-theme my-1" />

          {/* Grouped Icon Links */}
          <nav className="w-full flex flex-col items-center space-y-4">
            {siteConfig.nestedSidebarGroups.map((group, gIdx) => (
              <div key={group.title} className="w-full flex flex-col items-center space-y-1.5">
                {group.items.map((item: { title: string; href: string; icon: string; badge?: string }) => {
                  const isActive = pathname === item.href;

                  return (
                    <div key={item.href} className="relative group flex items-center justify-center">
                      <Link
                        href={item.href}
                        onClick={() => onSelect?.()}
                        title={item.badge ? `${item.title} (${item.badge})` : item.title}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer",
                          isActive
                            ? "bg-accent-light text-accent-primary font-bold ring-1 ring-accent-primary/40 shadow-xs"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/70"
                        )}
                        aria-label={item.title}
                      >
                        <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
                      </Link>

                      {/* Floating Tooltip */}
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-bg-primary text-text-primary text-xs font-semibold whitespace-nowrap shadow-xl border border-border-theme z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1 py-0.2 rounded font-mono bg-accent-light text-accent-primary">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {gIdx < siteConfig.nestedSidebarGroups.length - 1 && (
                  <div className="w-6 h-px bg-border-theme/40 my-1" />
                )}
              </div>
            ))}
          </nav>
        </div>
      ) : (
        /* Full Expanded Sidebar View */
        <div className="space-y-5">
          {/* Header with Collapse Button */}
          <div className="flex items-center justify-between pb-2 border-b border-border-theme/40">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:compass-bold" className="w-3.5 h-3.5 text-accent-primary" />
              <span>Navigation</span>
            </span>

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-3.5 h-3.5" />
            </button>
          </div>

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

                {/* Group Items / Submenu */}
                {isOpen && (
                  <ul className="space-y-0.5 ml-3 pl-2.5 border-l border-border-theme/70 pt-0.5">
                    {group.items.map((item: { title: string; href: string; icon: string; badge?: string }) => {
                      const isActive = pathname === item.href;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => onSelect?.()}
                            className={cn(
                              "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all gap-2",
                              isActive
                                ? "bg-accent-light text-accent-primary font-semibold shadow-xs"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60 font-normal"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0 opacity-80" />
                              <span className="truncate">{item.title}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={cn(
                                  "text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1.5",
                                  isActive
                                    ? "bg-accent-primary/20 text-accent-primary"
                                    : "bg-bg-tertiary text-text-muted border border-border-theme"
                                )}
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
      )}
    </aside>
  );
}

