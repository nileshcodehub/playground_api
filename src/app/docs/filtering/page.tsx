import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Query Filtering & Relations',
  description: 'Learn how to filter, paginate, sort, and query relational sub-resources in Playground API.',
};

export default function FilteringPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground-api-xi.vercel.app/api/v1';

  const paginationSnippet = `// 1. Pagination with limit and page
fetch('${publicApiUrl}/posts?_page=1&_limit=10')

// 2. Sorting by title descending
fetch('${publicApiUrl}/posts?_sort=title&_order=desc')

// 3. Full-text search across title and body
fetch('${publicApiUrl}/posts?q=javascript')`;

  const relationSnippet = `// 1. Fetch all posts written by user ID 1
fetch('${publicApiUrl}/users/1/posts')

// 2. Fetch all comments under post ID 1
fetch('${publicApiUrl}/posts/1/comments')

// 3. Fetch all todos assigned to user ID 1
fetch('${publicApiUrl}/users/1/todos')

// 4. Alternatively, use query parameter filtering
fetch('${publicApiUrl}/posts?user_id=1')`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Query Filtering & Relations
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API provides full JSONPlaceholder parity with query parameters for pagination, multi-field sorting, full-text search, and relational sub-resources.
        </p>
      </div>

      {/* 2. Pagination & Search */}
      <div id="pagination-search" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Pagination, Sorting & Full-Text Search
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          All collection endpoints support standard query parameters:
        </p>
        <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-theme bg-bg-tertiary/40 text-text-muted font-semibold">
                <th className="p-3">Parameter</th>
                <th className="p-3">Default</th>
                <th className="p-3 font-sans">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              <tr>
                <td className="p-3 font-bold text-accent-primary">_page</td>
                <td className="p-3 text-text-muted">1</td>
                <td className="p-3 font-sans text-text-secondary">Page number (1-indexed)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-accent-primary">_limit</td>
                <td className="p-3 text-text-muted">10</td>
                <td className="p-3 font-sans text-text-secondary">Number of items per page (max 30)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-accent-primary">_sort</td>
                <td className="p-3 text-text-muted">id</td>
                <td className="p-3 font-sans text-text-secondary">Field name to sort by (e.g. title, createdAt)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-accent-primary">_order</td>
                <td className="p-3 text-text-muted">asc</td>
                <td className="p-3 font-sans text-text-secondary">Sort direction (asc or desc)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-accent-primary">q</td>
                <td className="p-3 text-text-muted">-</td>
                <td className="p-3 font-sans text-text-secondary">Full-text search keyword across titles and bodies</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock code={paginationSnippet} language="javascript" title="paginationAndSearch.js" />
      </div>

      {/* 3. Relational Sub-Resources */}
      <div id="relational-subresources" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Relational Sub-Resource Endpoints
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Navigate nested relationships naturally using intuitive nested REST paths:
        </p>
        <CodeBlock code={relationSnippet} language="javascript" title="relations.js" />
      </div>

      {/* 4. Bottom Navigation */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        <Link
          href="/docs/recipes"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
        >
          <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
            <span>Framework Recipes</span>
          </div>
        </Link>

        <Link
          href="/docs/simulation"
          className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
        >
          <div>
            <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
            <span>Network Simulation</span>
          </div>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
