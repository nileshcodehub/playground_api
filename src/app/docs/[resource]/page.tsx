'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';
import { apiCatalog, EndpointDef } from '@/config/api-catalog';
import { EndpointCard } from '@/components/docs/EndpointCard';
import config from '@/config/env';

interface ResourcePageProps {
  params: Promise<{ resource: string }>;
}

const resourceSchemas: Record<string, { description: string; fields: Array<{ name: string; type: string; desc: string }> }> = {
  posts: {
    description: 'Blog post entries with author associations and full-text search indexing.',
    fields: [
      { name: 'id', type: 'number | string', desc: 'Integer for global baseline, local-<uuid> for sandbox created records.' },
      { name: 'user_id', type: 'number', desc: 'Foreign key reference to author user ID.' },
      { name: 'title', type: 'string', desc: 'Post headline title (indexed for search).' },
      { name: 'body', type: 'string', desc: 'Full markdown / text body content of the article.' },
    ],
  },
  users: {
    description: 'User profile records with address objects, company details, and avatar seeds.',
    fields: [
      { name: 'id', type: 'number | string', desc: 'User identifier.' },
      { name: 'name', type: 'string', desc: 'Full display name of the user.' },
      { name: 'username', type: 'string', desc: 'Unique account handle.' },
      { name: 'email', type: 'string', desc: 'Primary contact email address.' },
      { name: 'phone', type: 'string', desc: 'Contact phone number.' },
      { name: 'website', type: 'string', desc: 'Personal portfolio or business website URL.' },
      { name: 'address', type: 'object', desc: 'Nested object containing street, suite, city, and zipcode.' },
      { name: 'company', type: 'object', desc: 'Nested object with company name, catchPhrase, and bs.' },
    ],
  },
  comments: {
    description: 'Discussion comments linked to specific parent posts.',
    fields: [
      { name: 'id', type: 'number | string', desc: 'Comment identifier.' },
      { name: 'post_id', type: 'number', desc: 'Foreign key to the parent blog post.' },
      { name: 'name', type: 'string', desc: 'Comment subject line or commenter title.' },
      { name: 'email', type: 'string', desc: 'Author email address.' },
      { name: 'body', type: 'string', desc: 'Full comment text.' },
    ],
  },
  todos: {
    description: 'Checklist task items with completion status and user assignments.',
    fields: [
      { name: 'id', type: 'number | string', desc: 'Todo item ID.' },
      { name: 'user_id', type: 'number', desc: 'Owner user ID.' },
      { name: 'title', type: 'string', desc: 'Task description text.' },
      { name: 'completed', type: 'boolean', desc: 'Boolean completion status (true or false).' },
    ],
  },
  auth: {
    description: 'JWT Authentication simulation payloads including signed access and refresh tokens.',
    fields: [
      { name: 'accessToken', type: 'string (JWT)', desc: 'Signed 15-minute Bearer token with HMAC-SHA256 signature.' },
      { name: 'refreshToken', type: 'string (JWT)', desc: '30-day token exchangeable via POST /auth/refresh.' },
      { name: 'user', type: 'object', desc: 'Authenticated user profile object.' },
    ],
  },
  custom: {
    description: 'Dynamic schema-less resource records created on the fly in any named collection.',
    fields: [
      { name: 'id', type: 'string (local-...)', desc: 'Auto-generated sandbox UUID.' },
      { name: 'createdAt', type: 'ISO Date string', desc: 'Timestamp of record creation.' },
      { name: 'updatedAt', type: 'ISO Date string', desc: 'Timestamp of last modification.' },
      { name: '...customFields', type: 'any JSON value', desc: 'Arbitrary properties supplied in request payload.' },
    ],
  },
  avatars: {
    description: 'Dynamic vector SVG image generators for avatars and landscape thumbnails.',
    fields: [
      { name: 'seed', type: 'string', desc: 'Seed string hashed for colors and initials (e.g. Bret, Alice).' },
      { name: 'size', type: 'number (pixels)', desc: 'Width and height dimensions (32 to 512px).' },
      { name: 'format', type: 'SVG Vector', desc: 'High-DPI vector SVG compatible with <img> and <svg> tags.' },
    ],
  },
};

export default function ResourcePage({ params }: ResourcePageProps) {
  const resolvedParams = params && typeof (params as any).then === 'function' ? use(params) : (params as any);
  const resource = resolvedParams?.resource;
  const res = apiCatalog.find((r) => r.id === resource);

  const [activeMethodFilter, setActiveMethodFilter] = useState<'ALL' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('ALL');
  const [endpoints, setEndpoints] = useState<EndpointDef[]>(res?.endpoints || []);
  const [showSchema, setShowSchema] = useState(false);

  useEffect(() => {
    if (!res) return;
    setEndpoints(res.endpoints);

    // Fetch live sample data from backend to update GET response examples
    if (['users', 'posts', 'comments', 'todos'].includes(resource)) {
      fetch(`${config.apiUrl}/${resource}?limit=2`, { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : null))
        .then((liveData) => {
          if (liveData) {
            setEndpoints((prev) =>
              prev.map((ep) => {
                if (ep.method === 'GET' && ep.path === `/${resource}`) {
                  return { ...ep, responseExample: liveData };
                }
                if (ep.method === 'GET' && ep.path === `/${resource}/:id` && liveData.data?.[0]) {
                  return { ...ep, responseExample: liveData.data[0] };
                }
                return ep;
              })
            );
          }
        })
        .catch((err) => {
          console.warn(`[ResourcePage] Live sample fetch warning for ${resource}:`, err);
        });

      if (resource === 'users') {
        fetch(`${config.apiUrl}/users/1/posts?limit=2`, { credentials: 'include' })
          .then((r) => (r.ok ? r.json() : null))
          .then((postsData) => {
            if (postsData) {
              setEndpoints((prev) =>
                prev.map((ep) => (ep.path === '/users/:userId/posts' ? { ...ep, responseExample: postsData } : ep))
              );
            }
          });

        fetch(`${config.apiUrl}/users/1/todos?limit=2`, { credentials: 'include' })
          .then((r) => (r.ok ? r.json() : null))
          .then((todosData) => {
            if (todosData) {
              setEndpoints((prev) =>
                prev.map((ep) => (ep.path === '/users/:userId/todos' ? { ...ep, responseExample: todosData } : ep))
              );
            }
          });
      }

      if (resource === 'posts') {
        fetch(`${config.apiUrl}/posts/1/comments?limit=2`, { credentials: 'include' })
          .then((r) => (r.ok ? r.json() : null))
          .then((commentsData) => {
            if (commentsData) {
              setEndpoints((prev) =>
                prev.map((ep) => (ep.path === '/posts/:postId/comments' ? { ...ep, responseExample: commentsData } : ep))
              );
            }
          });
      }
    }
  }, [resource, res]);

  if (!res) {
    notFound();
  }

  const schemaInfo = resourceSchemas[resource];

  const filteredEndpoints = endpoints.filter((ep) => {
    if (activeMethodFilter === 'ALL') return true;
    return ep.method === activeMethodFilter;
  });

  const getMethodCount = (method: string) => {
    if (method === 'ALL') return endpoints.length;
    return endpoints.filter((e) => e.method === method).length;
  };

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* 1. Resource Clean Header */}
      <div id="overview" className="space-y-4 border-b border-border-theme/60 pb-6 scroll-mt-20">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-accent-light text-accent-primary shrink-0 shadow-xs">
            <Icon icon={res.icon} className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                {res.name} Collection
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {res.itemCount} {typeof res.itemCount === 'number' ? 'records' : ''}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed max-w-2xl">
              {res.description}
            </p>
          </div>
        </div>

        {/* Subtle Sandbox Persistence Indicator */}
        <div className="flex items-center gap-2 text-xs text-text-secondary py-1">
          <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Mutations on <code className="font-mono text-accent-primary">/{resource}</code> persist in your isolated session overlay without altering global baseline data.
          </span>
        </div>

        {/* Expandable Data Model Schema Inspector */}
        {schemaInfo && (
          <div className="rounded-2xl border border-border-theme/60 bg-bg-secondary/30 overflow-hidden">
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-text-primary hover:bg-bg-tertiary/40 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:tree-structure-bold" className="w-4 h-4 text-accent-primary" />
                <span>{res.singular} Data Model Schema & Fields</span>
              </span>
              <div className="flex items-center gap-1.5 text-text-muted">
                <span className="text-[11px] font-normal hidden sm:inline">
                  {showSchema ? 'Hide fields' : 'Inspect fields'}
                </span>
                <Icon
                  icon="ph:caret-down-bold"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showSchema ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {showSchema && (
              <div className="p-4 border-t border-border-theme/60 bg-bg-secondary/70 space-y-3 animate-in fade-in duration-150">
                <p className="text-xs text-text-secondary">{schemaInfo.description}</p>
                <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-tertiary/60">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-bg-tertiary border-b border-border-theme text-text-primary font-bold">
                        <th className="p-2.5">Field</th>
                        <th className="p-2.5">Data Type</th>
                        <th className="p-2.5 font-sans">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme text-text-secondary">
                      {schemaInfo.fields.map((f) => (
                        <tr key={f.name}>
                          <td className="p-2.5 text-accent-primary font-bold">{f.name}</td>
                          <td className="p-2.5 text-text-muted">{f.type}</td>
                          <td className="p-2.5 font-sans text-text-secondary">{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. HTTP Method Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="p-1 rounded-2xl bg-bg-secondary border border-border-theme/60 flex items-center gap-1 overflow-x-auto">
          {(['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const).map((method) => {
            const count = getMethodCount(method);
            const isActive = activeMethodFilter === method;

            return (
              <button
                key={method}
                onClick={() => setActiveMethodFilter(method)}
                disabled={count === 0}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-accent-primary text-white shadow-xs'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                <span>{method}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20 font-sans">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {filteredEndpoints.length} of {endpoints.length} endpoints
        </div>
      </div>

      {/* 3. Endpoint Cards List with Generous Spacing */}
      <div className="space-y-8">
        {filteredEndpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>

      {/* 4. Next / Prev Navigation Links */}
      <div className="pt-6 border-t border-border-theme/60 flex items-center justify-between gap-4">
        {res.prevPage ? (
          <Link
            href={res.prevPage.href}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group"
          >
            <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
            <span>Prev: {res.prevPage.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {res.nextPage && (
          <Link
            href={res.nextPage.href}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group ml-auto"
          >
            <span>Next: {res.nextPage.title}</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
