'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { useLiveCounts } from '@/context/CountsContext';

export function Footer() {
  const { counts } = useLiveCounts();

  return (
    <footer className="w-full border-t border-border-theme bg-bg-secondary transition-colors py-12 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Col 1: Brand Info & Author */}
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={36} className="w-9 h-9 shrink-0" />
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-text-primary">
                Playground API
              </span>
            </div>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-sm sm:max-w-md">
              Free, instant, zero-login stateful mock REST & GraphQL API service. Replaces generic static mock APIs with persistent per-visitor sandbox mutation overlays.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary hover:bg-border-theme text-text-secondary hover:text-text-primary text-xs sm:text-sm font-semibold transition-colors"
                title="View GitHub Repository"
              >
                <Icon icon="simple-icons:github" className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>

              <a
                href={siteConfig.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary hover:bg-border-theme text-text-secondary hover:text-text-primary text-xs sm:text-sm font-semibold transition-colors"
                title="Developer Portfolio & Profile"
              >
                <Icon icon="ph:globe-bold" className="w-4 h-4 text-accent-primary" />
                <span>By {siteConfig.author.name}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Core REST Resources */}
          <div className="space-y-3 col-span-1 sm:col-span-1 lg:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:database-bold" className="w-4 h-4 text-accent-primary" />
              <span>REST Collections</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link href="/docs/posts" className="hover:text-accent-primary transition-colors flex items-center justify-between">
                  <span>/api/v1/posts</span>
                  <span className="text-[11px] sm:text-xs font-mono text-text-muted">{counts.posts} items</span>
                </Link>
              </li>
              <li>
                <Link href="/docs/comments" className="hover:text-accent-primary transition-colors flex items-center justify-between">
                  <span>/api/v1/comments</span>
                  <span className="text-[11px] sm:text-xs font-mono text-text-muted">{counts.comments} items</span>
                </Link>
              </li>
              <li>
                <Link href="/docs/users" className="hover:text-accent-primary transition-colors flex items-center justify-between">
                  <span>/api/v1/users</span>
                  <span className="text-[11px] sm:text-xs font-mono text-text-muted">{counts.users} items</span>
                </Link>
              </li>
              <li>
                <Link href="/docs/todos" className="hover:text-accent-primary transition-colors flex items-center justify-between">
                  <span>/api/v1/todos</span>
                  <span className="text-[11px] sm:text-xs font-mono text-text-muted">{counts.todos} items</span>
                </Link>
              </li>
              <li>
                <Link href="/docs/auth" className="hover:text-accent-primary transition-colors flex items-center justify-between">
                  <span>/api/v1/auth</span>
                  <span className="text-[11px] sm:text-xs font-mono text-emerald-400 font-semibold">JWT Bearer</span>
                </Link>
              </li>
              <li>
                <Link href="/docs/custom" className="hover:text-accent-primary transition-colors flex items-center justify-between">
                  <span>/api/v1/custom</span>
                  <span className="text-[11px] sm:text-xs font-mono text-amber-400 font-semibold">
                    {typeof counts.custom === 'number' && counts.custom > 0 ? `${counts.custom} items` : 'Dynamic'}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections & Gateways */}
          <div className="space-y-3 col-span-1 sm:col-span-1 lg:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:folders-bold" className="w-4 h-4 text-accent-primary" />
              <span>Schemas & Exports</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link href="/docs/graphql" className="hover:text-accent-primary transition-colors flex items-center gap-1.5">
                  <Icon icon="simple-icons:graphql" className="w-3.5 h-3.5 text-pink-500" />
                  GraphQL Explorer
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/openapi" className="hover:text-accent-primary transition-colors flex items-center gap-1.5">
                  <Icon icon="simple-icons:openapi" className="w-3.5 h-3.5 text-emerald-400" />
                  OpenAPI 3.0 Spec
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/postman" className="hover:text-accent-primary transition-colors flex items-center gap-1.5">
                  <Icon icon="simple-icons:postman" className="w-3.5 h-3.5 text-orange-400" />
                  Postman Collection
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/bruno" className="hover:text-accent-primary transition-colors flex items-center gap-1.5">
                  <Icon icon="ph:brackets-curly-bold" className="w-3.5 h-3.5 text-yellow-400" />
                  Bruno Collection
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/typescript" className="hover:text-accent-primary transition-colors flex items-center gap-1.5">
                  <Icon icon="simple-icons:typescript" className="w-3.5 h-3.5 text-blue-400" />
                  TypeScript SDK (.d.ts)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Developer Tools */}
          <div className="space-y-3 col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:wrench-bold" className="w-4 h-4 text-accent-primary" />
              <span>Platform & AI</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link href="/docs/studio" className="hover:text-accent-primary transition-colors font-medium text-accent-primary flex items-center gap-1">
                  <Icon icon="ph:play-circle-bold" className="w-3.5 h-3.5" />
                  Interactive API Studio
                </Link>
              </li>
              <li>
                <Link href="/docs/export-import" className="hover:text-accent-primary transition-colors flex items-center gap-1">
                  <Icon icon="ph:cloud-arrow-up-bold" className="w-3.5 h-3.5" />
                  State Snapshot Import/Export
                </Link>
              </li>
              <li>
                <Link href="/docs/stats" className="hover:text-accent-primary transition-colors flex items-center gap-1">
                  <Icon icon="ph:chart-bar-bold" className="w-3.5 h-3.5" />
                  Session Quotas & Activity
                </Link>
              </li>
              <li>
                <a href={siteConfig.healthUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors flex items-center gap-1">
                  <Icon icon="ph:heartbeat-bold" className="w-3.5 h-3.5 text-rose-400" />
                  API Health Metrics
                </a>
              </li>
              <li>
                <a href="/llms.txt" target="_blank" className="hover:text-accent-primary transition-colors flex items-center gap-1 font-mono font-medium text-emerald-400">
                  <Icon icon="ph:robot-bold" className="w-3.5 h-3.5" />
                  /llms.txt (AI Spec)
                </a>
              </li>
              <li>
                <a href="/llms-full.txt" target="_blank" className="hover:text-accent-primary transition-colors flex items-center gap-1 font-mono font-medium text-emerald-400">
                  <Icon icon="ph:file-text-bold" className="w-3.5 h-3.5" />
                  /llms-full.txt (Full AI Spec)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border-theme flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-text-muted">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} Playground API. Created by</span>
            <a
              href={siteConfig.author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-text-primary hover:text-accent-primary transition-colors underline"
            >
              {siteConfig.author.name}
            </a>
            <span>• Open Source (ISC)</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.healthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-mono font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Status: Operational
            </a>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-bg-tertiary text-[11px] sm:text-xs font-mono font-medium text-text-secondary border border-border-theme">
              {siteConfig.apiVersion}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

