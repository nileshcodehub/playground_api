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

export default function ResourcePage({ params }: ResourcePageProps) {
  const resolvedParams = params && typeof (params as any).then === 'function' ? use(params) : (params as any);
  const resource = resolvedParams?.resource;
  const res = apiCatalog.find((r) => r.id === resource);

  const [endpoints, setEndpoints] = useState<EndpointDef[]>(res?.endpoints || []);

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
        .catch(() => {});
    }
  }, [resource, res]);

  if (!res) {
    notFound();
  }

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Resource Clean Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          {res.name}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          {res.description} All mutations persist in your isolated session overlay.
        </p>
      </div>

      {/* 2. Endpoints List */}
      <div className="space-y-10">
        {endpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>

      {/* 3. Next / Prev Navigation Links */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        {res.prevPage ? (
          <Link
            href={res.prevPage.href}
            className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3"
          >
            <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-[10px] text-text-muted block uppercase font-mono">Previous</span>
              <span>{res.prevPage.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {res.nextPage && (
          <Link
            href={res.nextPage.href}
            className="p-4 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group flex items-center gap-3 text-right ml-auto"
          >
            <div>
              <span className="text-[10px] text-text-muted block uppercase font-mono">Next</span>
              <span>{res.nextPage.title}</span>
            </div>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
