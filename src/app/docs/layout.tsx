import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] w-full relative">
      {/* Sticky Fixed Sidebar for Desktop */}
      <Sidebar className="hidden md:block" />
      
      {/* Main Content Area - Scrolls naturally down the page to the footer */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-10 min-w-0 w-full">{children}</main>
    </div>
  );
}
