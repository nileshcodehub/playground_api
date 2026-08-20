'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export function UseCasesSection() {
  const useCases = [
    {
      title: 'Portfolio & Interview Take-Home Apps',
      audience: 'Frontend Developers',
      icon: 'ph:briefcase-bold',
      accentColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description:
        'Build real eCommerce stores, Kanban boards, or social feeds that recruiters and interviewers can actually test live. Items added by the user stay in their browser without a real database.',
      bullets: [
        'Persistent cart items & task updates',
        'Working JWT login/register flows',
        'Custom collection schemas on the fly',
      ],
      link: '/docs/showcase',
      linkText: 'Explore React Showcase',
    },
    {
      title: 'Automated E2E & Component Testing',
      audience: 'QA & Test Engineers',
      icon: 'ph:flask-bold',
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description:
        'Run deterministic Playwright, Cypress, or Jest suites without spinning up Docker or cloud staging databases. Test slow network spinners and 500 error boundary fallbacks reliably.',
      bullets: [
        'Deterministic test runs with X-Playground-Identity',
        'Latency simulation with X-Simulate-Delay',
        'Instant test teardown with DELETE /session/reset',
      ],
      link: '/docs/simulation',
      linkText: 'Learn Network Simulation',
    },
    {
      title: 'AI Coding Agents & Prompt Sandboxes',
      audience: 'AI Engineers & Copilots',
      icon: 'ph:robot-bold',
      accentColor: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      description:
        'Feed our structured /llms.txt documentation into Cursor, Claude, ChatGPT, or GitHub Copilot to let AI agents build complete, working web apps connected to persistent mock APIs.',
      bullets: [
        'Machine-readable schema at /llms.txt',
        'Zero API keys or auth hurdles for AI agents',
        'TypeScript definitions via /public/types/ts',
      ],
      link: '/docs/ai',
      linkText: 'View AI Knowledge Docs',
    },
    {
      title: 'Classrooms, Bootcamps & Workshops',
      audience: 'Educators & Content Creators',
      icon: 'ph:graduation-cap-bold',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description:
        'Teach React, Vue, Svelte, or Flutter to hundreds of students simultaneously. Because each student gets an isolated browser sandbox, they never overwrite or delete each other’s records.',
      bullets: [
        'No student database setup or SQL headaches',
        'Multi-format collections for Postman & Bruno',
        'Unified REST and GraphQL endpoints',
      ],
      link: '/docs/recipes',
      linkText: 'Explore Framework Recipes',
    },
  ];

  return (
    <section className="py-20 bg-bg-secondary border-b border-border-theme relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold font-mono">
            <Icon icon="ph:users-three-bold" className="w-4 h-4" />
            <span>Target Use Cases</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Built for Every Stage of Frontend Development
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            From single-page portfolio projects to automated CI/CD pipelines and interactive programming classrooms.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="p-7 sm:p-8 rounded-3xl glass-panel border border-border-theme/80 hover:border-accent-primary/40 transition-all flex flex-col justify-between space-y-6 group shadow-sm hover:shadow-xl relative bg-bg-primary/50"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-bg-tertiary flex items-center justify-center ${uc.accentColor} group-hover:scale-110 transition-transform shadow-xs`}>
                    <Icon icon={uc.icon} className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${uc.badgeBg}`}>
                    {uc.audience}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {uc.description}
                  </p>
                </div>

                {/* Bullet List */}
                <ul className="space-y-2 pt-2 text-xs sm:text-sm text-text-muted">
                  {uc.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                      <span className="text-text-secondary">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Link CTA */}
              <div className="pt-4 border-t border-border-theme">
                <Link
                  href={uc.link}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-primary hover:underline"
                >
                  <span>{uc.linkText}</span>
                  <Icon icon="ph:arrow-right-bold" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
export default UseCasesSection;
