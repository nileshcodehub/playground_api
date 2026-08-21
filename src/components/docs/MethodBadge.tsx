import React from 'react';
import { cn } from '@/lib/utils';

interface MethodBadgeProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  className?: string;
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const methodStyles = {
    GET: 'bg-badge-get-bg text-badge-get border-badge-get-border',
    POST: 'bg-badge-post-bg text-badge-post border-badge-post-border',
    PUT: 'bg-badge-put-bg text-badge-put border-badge-put-border',
    PATCH: 'bg-badge-patch-bg text-badge-patch border-badge-patch-border',
    DELETE: 'bg-badge-delete-bg text-badge-delete border-badge-delete-border',
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
