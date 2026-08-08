import React from 'react';
import { Icon } from '@iconify/react';

export const metadata = {
  title: 'Community Project Showcase',
  description: 'Showcase of real-world applications and open-source projects built using Playground API.',
};

export default function ShowcasePage() {
  return (
    <div className="space-y-8 w-full max-w-none">
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:rocket-launch-bold" className="w-4 h-4" />
          Project Showcase
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Built with Playground API
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Discover awesome web applications, mobile apps, tutorials, and AI agents built on top of Playground API.
        </p>
      </div>

      <div id="community-submissions" data-toc-title="Community Submissions" className="p-8 rounded-2xl glass-panel border border-border-theme text-center space-y-4 scroll-mt-20">
        <div className="w-16 h-16 rounded-2xl bg-accent-light text-accent-primary flex items-center justify-center mx-auto">
          <Icon icon="ph:sparkle-bold" className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-text-primary">Community Submissions Opening Soon</h3>
        <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          Have you built a project, tutorial, or React/Next.js demo using Playground API? Submit your project to be featured in our showcase gallery.
        </p>
        <a
          href="https://github.com/nileshcodehub/playground_api/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold transition-all"
        >
          <Icon icon="simple-icons:github" className="w-4 h-4" />
          Submit Your Project on GitHub
        </a>
      </div>
    </div>
  );
}
