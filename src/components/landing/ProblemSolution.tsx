'use client';

import React from 'react';
import { Icon } from '@iconify/react';

export function ProblemSolution() {
  return (
    <section className="py-20 bg-bg-secondary border-b border-border-theme relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold font-mono">
            <Icon icon="ph:scales-bold" className="w-4 h-4" />
            <span>The Statefulness Problem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Traditional Mock APIs Fake It.{' '}
            <span className="text-accent-primary">Playground API Saves It.</span>
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Why building realistic frontend prototypes with legacy mock backends always falls short — and how our per-visitor sandbox fixes it.
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: Legacy Mock APIs (The Problem) */}
          <div className="rounded-3xl border border-rose-500/30 bg-bg-primary/80 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-theme">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm sm:text-base">
                  <Icon icon="ph:x-circle-bold" className="w-5 h-5 text-rose-500" />
                  <span>Legacy Mock APIs (JSONPlaceholder, etc.)</span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Fake Payload Echo
                </span>
              </div>

              {/* Code Flow Demonstration */}
              <div className="space-y-3 font-mono text-xs">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme space-y-1.5">
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="text-rose-400 font-bold">1. POST /posts</span>
                    <span className="text-emerald-400">201 Created</span>
                  </div>
                  <p className="text-text-secondary font-sans text-xs">
                    Returns fake object: <code className="text-text-primary">{"{ id: 101, title: 'New Post' }"}</code>
                  </p>
                </div>

                {/* Step 2 (Failure) */}
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-rose-400 font-bold">
                    <span>2. GET /posts</span>
                    <span className="text-rose-400">❌ Missing!</span>
                  </div>
                  <p className="text-rose-300 font-sans text-xs">
                    Your newly created post is nowhere to be found. The server never stored it.
                  </p>
                </div>
              </div>

              {/* Drawback Checklist */}
              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <Icon icon="ph:x-bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Mutations vanish on subsequent requests and page reloads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="ph:x-bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Cannot test real CRUD interfaces, shopping carts, or task lists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="ph:x-bold" className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>No working JWT auth loops or protected endpoints.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border-theme text-xs font-medium text-rose-400/90 flex items-center gap-1.5">
              <Icon icon="ph:warning-circle-bold" className="w-4 h-4 shrink-0" />
              <span>Breaks realistic testing and interviewer demonstrations</span>
            </div>
          </div>

          {/* RIGHT: Playground API (The Solution) */}
          <div className="rounded-3xl border border-accent-primary/40 bg-linear-to-b from-accent-light/30 via-bg-primary to-bg-primary p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl relative ring-1 ring-accent-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-theme">
                <div className="flex items-center gap-2 text-accent-primary font-bold text-sm sm:text-base">
                  <Icon icon="ph:check-circle-bold" className="w-5 h-5 text-accent-primary" />
                  <span>Playground API</span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-accent-light text-accent-primary border border-accent-primary/30">
                  Virtual State Sandbox
                </span>
              </div>

              {/* Code Flow Demonstration */}
              <div className="space-y-3 font-mono text-xs">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme space-y-1.5">
                  <div className="flex items-center justify-between text-text-muted">
                    <span className="text-accent-primary font-bold">1. POST /posts</span>
                    <span className="text-accent-primary">201 Created</span>
                  </div>
                  <p className="text-text-secondary font-sans text-xs">
                    Persists into your private session overlay: <code className="text-accent-primary">{"{ id: 101, ... }"}</code>
                  </p>
                </div>

                {/* Step 2 (Success) */}
                <div className="p-3.5 rounded-xl bg-accent-light/40 border border-accent-primary/30 space-y-1.5">
                  <div className="flex items-center justify-between text-accent-primary font-bold">
                    <span>2. GET /posts</span>
                    <span className="text-emerald-400">✅ Post Persisted!</span>
                  </div>
                  <p className="text-text-secondary font-sans text-xs">
                    Your post appears at the top of the list across page refreshes and components.
                  </p>
                </div>
              </div>

              {/* Advantage Checklist */}
              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-text-primary">
                <li className="flex items-start gap-2">
                  <Icon icon="ph:check-bold" className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <span>Full CRUD persistence (POST, PUT, PATCH, DELETE) in your private session.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="ph:check-bold" className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <span>Zero sign-up or database setup — automatic browser session isolation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="ph:check-bold" className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                  <span>Full JWT auth, custom collections, network delay headers, and snapshot exports.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border-theme text-xs font-semibold text-accent-primary flex items-center gap-1.5">
              <Icon icon="ph:sparkle-bold" className="w-4 h-4 shrink-0" />
              <span>Behaves exactly like a real backend for frontend apps</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default ProblemSolution;
