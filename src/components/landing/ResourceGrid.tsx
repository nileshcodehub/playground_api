'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { apiCatalog } from '@/config/api-catalog';
import { useLiveCounts } from '@/context/CountsContext';

export function ResourceGrid() {
  const { counts } = useLiveCounts();

  const getDynamicBadge = (resId: string, defaultCount: number | string) => {
    if (resId === 'posts') return `${counts.posts} items`;
    if (resId === 'comments') return `${counts.comments} items`;
    if (resId === 'users') return `${counts.users} items`;
    if (resId === 'todos') return `${counts.todos} items`;
    if (resId === 'custom' && typeof counts.custom === 'number' && counts.custom > 0) {
      return `${counts.custom} items`;
    }
    return typeof defaultCount === 'number' ? `${defaultCount} items` : String(defaultCount);
  };

  return (
    <section className="py-20 bg-bg-secondary border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
            Available Mock API Collections
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Explore Built-in Mock Datasets
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Ready-to-use resources with full pagination, filtering, full-text search, and relational support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiCatalog.map((res) => {
            const badgeText = getDynamicBadge(res.id, res.itemCount);

            return (
              <Link
                key={res.id}
                href={`/docs/${res.id}`}
                className="p-6 rounded-2xl glass-panel hover:border-accent-primary/50 transition-all space-y-4 group block"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon icon={res.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-semibold px-2.5 py-1 rounded-full bg-bg-tertiary text-accent-primary border border-border-theme">
                    {badgeText}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors flex items-center gap-1.5">
                    {res.name}
                    <Icon icon="ph:arrow-right-bold" className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-2 border-t border-border-theme flex items-center justify-between text-xs sm:text-sm text-text-muted font-mono">
                  <span>{res.endpoints.length} Endpoints</span>
                  <span className="text-accent-primary font-semibold">/api/v1/{res.id}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
