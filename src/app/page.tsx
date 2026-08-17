import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { LiveVisualShowcase } from '@/components/landing/LiveVisualShowcase';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { CompareTable } from '@/components/landing/CompareTable';
import { QuickstartTabs } from '@/components/landing/QuickstartTabs';
import { ResourceGrid } from '@/components/landing/ResourceGrid';
import { FAQAccordion } from '@/components/landing/FAQAccordion';

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
