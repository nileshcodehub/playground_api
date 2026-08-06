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
  const { resource } = use(params);
  const res = apiCatalog.find((r) => r.id === resource);

  const [activeMethodFilter, setActiveMethodFilter] = useState<'ALL' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('ALL');
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
        .catch((err) => {
          console.warn(`[ResourcePage] Live sample fetch warning for ${resource}:`, err);
        });
    }
  }, [resource, res]);

  if (!res) {
    notFound();
  }

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
      {/* Resource Header */}
      <div className="space-y-3 border-b border-border-theme pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-accent-light text-accent-primary">
            <Icon icon={res.icon} className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">
              {res.name} Resource Documentation
            </h1>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              REST API endpoints for managing {res.name} records in global baseline seed data overlaid with your active session sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* HTTP Method Filter Tabs Bar */}
      <div className="p-1.5 rounded-2xl bg-bg-secondary border border-border-theme flex items-center gap-1.5 overflow-x-auto">
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
                  ? 'bg-accent-primary text-white shadow-md'
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

      {/* Endpoint Cards List */}
      <div className="space-y-8">
        {filteredEndpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}
      </div>

      {/* Next / Prev Navigation Links */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        {res.prevPage ? (
          <Link
            href={res.prevPage.href}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs font-bold text-text-primary transition-all group"
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
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs font-bold text-text-primary transition-all group ml-auto"
          >
            <span>Next: {res.nextPage.title}</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}

