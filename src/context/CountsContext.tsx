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
      const res = await fetch(`${config.apiUrl}/counts`, {
        credentials: 'include',
      });
      if (res.ok) {
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
