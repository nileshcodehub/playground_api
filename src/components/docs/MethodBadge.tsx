import React from 'react';
import { cn } from '@/lib/utils';

interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  className?: string;
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const methodStyles = {
    GET: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    POST: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    PUT: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    PATCH: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
    DELETE: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-mono font-bold uppercase border shadow-xs inline-flex items-center justify-center shrink-0',
        methodStyles[method] || 'bg-bg-tertiary text-text-primary border-border-theme',
        className
      )}
    >
      {method}
    </span>
  );
}
