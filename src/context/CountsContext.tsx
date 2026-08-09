'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import config from '@/config/env';

export interface ResourceCounts {
  users: number | string;
  posts: number | string;
  comments: number | string;
  todos: number | string;
  auth: string;
  custom: number | string;
  avatars: string;
}

export interface ResourceDetails {
  global: number;
  created: number;
  updated: number;
  deleted: number;
  effective: number;
}

export interface CountsContextType {
  counts: ResourceCounts;
  details: Record<string, ResourceDetails>;
  totalGlobalRecords: number;
  activeIdentities: number;
  isLoading: boolean;
  refreshCounts: () => Promise<void>;
}

const DEFAULT_COUNTS: ResourceCounts = {
  users: 25,
  posts: 100,
  comments: 300,
  todos: 125,
  auth: 'Auth',
  custom: 'Dynamic',
  avatars: 'SVG',
};

const DEFAULT_DETAILS: Record<string, ResourceDetails> = {
  users: { global: 25, created: 0, updated: 0, deleted: 0, effective: 25 },
  posts: { global: 100, created: 0, updated: 0, deleted: 0, effective: 100 },
  comments: { global: 300, created: 0, updated: 0, deleted: 0, effective: 300 },
  todos: { global: 125, created: 0, updated: 0, deleted: 0, effective: 125 },
};

const CountsContext = createContext<CountsContextType>({
  counts: DEFAULT_COUNTS,
  details: DEFAULT_DETAILS,
  totalGlobalRecords: 550,
  activeIdentities: 1,
  isLoading: false,
  refreshCounts: async () => {},
});

export function CountsProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState<ResourceCounts>(DEFAULT_COUNTS);
  const [details, setDetails] = useState<Record<string, ResourceDetails>>(DEFAULT_DETAILS);
  const [totalGlobalRecords, setTotalGlobalRecords] = useState(550);
  const [activeIdentities, setActiveIdentities] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('pg_identity') : '';
      const match = typeof document !== 'undefined' ? document.cookie.match(/pg_identity=([^;]+)/) : null;
      const cookieToken = match ? match[1] : '';
      const token = localToken || cookieToken;

      const headers: Record<string, string> = {};
      if (token) {
        headers['X-Playground-Identity'] = token;
      }

      const res = await fetch(`${config.apiUrl}/counts`, {
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        const returnedToken = res.headers.get('x-playground-identity');
        if (returnedToken && typeof window !== 'undefined') {
          localStorage.setItem('pg_identity', returnedToken);
        }

        const data = await res.json();
        if (data && data.counts) {
          setCounts({
            users: data.counts.users ?? 25,
            posts: data.counts.posts ?? 100,
            comments: data.counts.comments ?? 300,
            todos: data.counts.todos ?? 125,
            auth: data.counts.auth ?? 'Auth',
            custom: data.counts.custom ?? 'Dynamic',
            avatars: data.counts.avatars ?? 'SVG',
          });
        }
        if (data && data.details) {
          setDetails(data.details);
        }
        if (data && data.totalGlobalRecords) {
          setTotalGlobalRecords(data.totalGlobalRecords);
        }
        if (data && data.activeIdentities) {
          setActiveIdentities(data.activeIdentities);
        }
      }
    } catch (err) {
      console.warn('[CountsContext] Live database counts fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();

    const handleMutation = () => {
      fetchCounts();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('playground:mutation', handleMutation);
      return () => {
        window.removeEventListener('playground:mutation', handleMutation);
      };
    }
  }, [fetchCounts]);

  return (
    <CountsContext.Provider
      value={{
        counts,
        details,
        totalGlobalRecords,
        activeIdentities,
        isLoading,
        refreshCounts: fetchCounts,
      }}
    >
      {children}
    </CountsContext.Provider>
  );
}

export const useLiveCounts = () => useContext(CountsContext);

export default CountsContext;
