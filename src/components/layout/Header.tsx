'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { SandboxPill } from '@/components/dashboard/SandboxPill';
import { StatsModal } from '@/components/dashboard/StatsModal';
import { Sidebar } from '@/components/layout/Sidebar';
import { siteConfig } from '@/config/site';

export function Header() {
  const [statsOpen, setStatsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary transition-colors cursor-pointer md:hidden shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Icon icon={mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'} className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <LogoIcon size={32} className="group-hover:scale-105 transition-transform shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-text-primary truncate">
                    Playground API
                  </span>
                  <span className="bg-accent-light text-accent-primary text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md border border-accent-primary/20 hidden xs:inline-block">
                    {siteConfig.apiVersion}
                  </span>
                </div>
                <span className="text-xs text-text-muted hidden md:inline">Mock REST & GraphQL</span>
              </div>
            </Link>
          </div>

          {/* Right: Actions & Tools (Stats, Sandbox Status, Theme, GitHub) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Docs Navigation Link */}
            <nav className="hidden md:flex items-center gap-1 ml-2 lg:ml-4">
              <Link
                href="/docs/introduction"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <Icon icon="ph:book-open-text-bold" className="w-4 h-4 text-accent-primary" />
                Docs
              </Link>
            </nav>
            {/* Stats Dashboard Modal Trigger */}
            <button
              onClick={() => setStatsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-medium text-text-primary transition-colors cursor-pointer"
              title="Open Session Quota Dashboard"
            >
              <Icon icon="ph:chart-bar-bold" className="w-4 h-4 text-accent-primary" />
              <span className="hidden sm:inline">Stats</span>
            </button>

            {/* Sandbox Status Pill */}
            <div className="hidden xs:block">
              <SandboxPill />
            </div>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* GitHub Repo Button */}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary transition-colors"
              title="GitHub Repository"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-black/70 flex flex-col md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-bg-secondary border-b border-border-theme shadow-2xl p-4 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-4 w-full">
            <div className="flex items-center justify-between pb-3 border-b border-border-theme">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
                <Icon icon="ph:compass-bold" className="w-4 h-4 text-accent-primary" />
                Documentation Menu
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary cursor-pointer"
                aria-label="Close menu"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Sidebar Navigation Links */}
            <Sidebar onSelect={() => setMobileMenuOpen(false)} className="border-r-0 p-0 shadow-none" />

            {/* Mobile Footer Extra Actions */}
            <div className="pt-4 border-t border-border-theme space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-text-muted font-medium">Theme Mode</span>
                <MobileThemeToggle />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-text-muted font-medium">Sandbox Session</span>
                <SandboxPill />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      <StatsModal isOpen={statsOpen} onClose={() => setStatsOpen(false)} />
    </>
  );
}

function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 bg-bg-tertiary p-1 rounded-xl border border-border-theme">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-accent-primary text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Icon icon="ph:sun-bold" className="w-3.5 h-3.5" /> Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-accent-primary text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Icon icon="ph:moon-bold" className="w-3.5 h-3.5" /> Dark
      </button>
    </div>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const activeTheme = mounted ? theme : 'dark';

  return (
    <div className="relative" ref={dropdownRef} suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        aria-label="Toggle theme selection"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon
          icon={activeTheme === 'dark' ? 'ph:moon-bold' : 'ph:sun-bold'}
          className="w-4 h-4 text-accent-primary"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full pt-2 z-50">
          <div className="w-36 flex flex-col gap-1 bg-bg-secondary border border-border-theme rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTheme === 'light'
                  ? 'bg-accent-light text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:sun-bold" className="w-4 h-4 text-amber-500" /> Light
              </span>
              {activeTheme === 'light' && <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-accent-primary" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTheme === 'dark'
                  ? 'bg-accent-light text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:moon-bold" className="w-4 h-4 text-indigo-400" /> Dark
              </span>
              {activeTheme === 'dark' && <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-accent-primary" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
