import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="w-full border-t border-border-theme bg-bg-secondary transition-colors py-12 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
                <Icon icon="carbon:api" className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-text-primary">
                Playground API
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Free, instant, sandboxed mock REST & GraphQL API service. Replaces JSONPlaceholder & Platzi Fake API with persistent per-identity mutation overlays.
            </p>
            <div className="flex items-center gap-3 text-text-muted">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-primary transition-colors"
                title="GitHub"
              >
                <Icon icon="simple-icons:github" className="w-5 h-5" />
              </a>
              <a
                href="/llms.txt"
                target="_blank"
                className="hover:text-accent-primary transition-colors text-xs font-mono font-semibold"
                title="AI LLM Summary text file"
              >
                /llms.txt
              </a>
            </div>
          </div>

          {/* Col 2: Core Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Core Resources
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/docs/posts" className="hover:text-accent-primary transition-colors">
                  /api/v1/posts (100 items)
                </Link>
              </li>
              <li>
                <Link href="/docs/comments" className="hover:text-accent-primary transition-colors">
                  /api/v1/comments (500 items)
                </Link>
              </li>
              <li>
                <Link href="/docs/users" className="hover:text-accent-primary transition-colors">
                  /api/v1/users (10 items)
                </Link>
              </li>
              <li>
                <Link href="/docs/todos" className="hover:text-accent-primary transition-colors">
                  /api/v1/todos (200 items)
                </Link>
              </li>
              <li>
                <Link href="/docs/auth" className="hover:text-accent-primary transition-colors">
                  /api/v1/auth (JWT Simulation)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: API Collections & Gateways */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Collections & Gateways
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/docs/graphql" className="hover:text-accent-primary transition-colors flex items-center gap-1.5">
                  <Icon icon="simple-icons:graphql" className="w-3.5 h-3.5 text-pink-500" />
                  GraphQL Gateway Explorer
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/openapi" className="hover:text-accent-primary transition-colors">
                  OpenAPI 3.0 Specs
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/postman" className="hover:text-accent-primary transition-colors">
                  Postman Collection
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/bruno" className="hover:text-accent-primary transition-colors">
                  Bruno Collection
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/typescript" className="hover:text-accent-primary transition-colors">
                  TypeScript Definitions (.d.ts)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Developer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/docs/introduction" className="hover:text-accent-primary transition-colors">
                  Getting Started Overview
                </Link>
              </li>
              <li>
                <Link href="/docs/studio" className="hover:text-accent-primary transition-colors font-medium text-accent-primary">
                  Interactive API Studio
                </Link>
              </li>
              <li>
                <Link href="/docs/export-import" className="hover:text-accent-primary transition-colors">
                  Session Snapshot JSON Tool
                </Link>
              </li>
              <li>
                <Link href="/docs/stats" className="hover:text-accent-primary transition-colors">
                  Session Quotas & Limits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border-theme flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            © {new Date().getFullYear()} Playground API. Open-source mock API service for developers.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-tertiary text-[11px] font-mono font-medium text-text-secondary">
              API Version: {siteConfig.apiVersion}
            </span>
            <Link href="/llms.txt" className="hover:text-text-primary transition-colors">
              LLMs Text
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
