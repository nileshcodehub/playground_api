import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { OnThisPage } from '@/components/docs/OnThisPage';
import { DocPagination } from '@/components/docs/DocPagination';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full relative bg-bg-primary">
      {/* Sticky Sidebar for Desktop (Left) */}
      <Sidebar className="hidden md:block" />

      {/* Main Content Area - Expansive, Fluid & Balanced Width */}
      <main
        id="docs-content"
        className="flex-1 min-w-0 w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 flex justify-center"
      >
        <div className="w-full max-w-5xl xl:max-w-6xl space-y-10 pb-16 transition-all duration-300">
          {children}
          <DocPagination />
        </div>
      </main>

      {/* Sticky Table of Contents (Right) */}
      <OnThisPage className="hidden xl:block" />
    </div>
  );
}
