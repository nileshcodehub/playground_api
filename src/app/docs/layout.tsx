import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { OnThisPage } from '@/components/docs/OnThisPage';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full relative bg-bg-primary">
      {/* Sticky Sidebar for Desktop (Left) */}
      <Sidebar className="hidden md:block" />

      {/* Main Content Area - Optimized Max-Width & Generous Breathing Room */}
      <main
        id="docs-content"
        className="flex-1 min-w-0 w-full px-4 sm:px-8 md:px-12 py-8 md:py-12 flex justify-center"
      >
        <div className="w-full max-w-4xl space-y-12 pb-16">
          {children}
        </div>
      </main>

      {/* Sticky Table of Contents (Right) */}
      <OnThisPage className="hidden xl:block" />
    </div>
  );
}
