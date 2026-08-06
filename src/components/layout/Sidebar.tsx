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
    'About & Overview': true,
    'Identity & Sandbox': true,
    'REST API Collections': true,
    'GraphQL API Gateway': true,
    'API Downloads & Specs': true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className={`w-full md:w-64 lg:w-72 shrink-0 border-r border-border-theme bg-bg-secondary p-4 space-y-6 transition-colors md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto ${className}`}>
      <div className="space-y-4">
        {siteConfig.nestedSidebarGroups.map((group) => {
          const isOpen = openGroups[group.title] !== false;

          return (
            <div key={group.title} className="space-y-1.5">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon icon={group.icon} className="w-4 h-4 text-accent-primary" />
                  {group.title}
                </span>
                <Icon
                  icon="ph:caret-down-bold"
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {/* Group Items */}
              {isOpen && (
                <ul className="pl-2 space-y-1 border-l border-border-theme ml-3">
                  {group.items.map((item: { title: string; href: string; icon: string; badge?: string }) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => onSelect?.()}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-accent-light text-accent-primary font-bold shadow-xs border-l-2 border-accent-primary'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Icon icon={item.icon} className="w-4 h-4 shrink-0 text-text-muted" />
                            <span className="truncate">{item.title}</span>
                          </span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-bg-tertiary text-text-muted border border-border-theme font-mono">
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
