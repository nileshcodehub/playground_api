import type { Metadata } from 'next';
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { LiveVisualShowcase } from '@/components/landing/LiveVisualShowcase';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { CompareTable } from '@/components/landing/CompareTable';
import { QuickstartTabs } from '@/components/landing/QuickstartTabs';
import { ResourceGrid } from '@/components/landing/ResourceGrid';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
  description:
    'Free, instant, stateful mock REST & GraphQL API sandbox for web & mobile development. Features persistent per-session CRUD mutation overlays, JWT auth loops, custom collections, and network latency simulation.',
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'The modern JSONPlaceholder alternative where mutations actually persist in an isolated, zero-login per-visitor sandbox overlay.',
    url: siteConfig.url,
    siteName: 'Playground API',
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <LiveVisualShowcase />
      <FeatureGrid />
      <CompareTable />
      <QuickstartTabs />
      <ResourceGrid />
      <FAQAccordion />
    </div>
  );
}
