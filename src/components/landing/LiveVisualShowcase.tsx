'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export function LiveVisualShowcase() {
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedProduct, setCopiedProduct] = useState(false);

  const postsUrl = `[GET] ${config.publicApiUrl}/posts?_limit=4`;
  const usersUrl = `[GET] ${config.publicApiUrl}/users?_limit=4`;
  const customUrl = `[GET] ${config.publicApiUrl}/custom/products`;

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text.replace('[GET] ', ''));
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const samplePosts = [
    {
      id: 1,
      title: 'Building Modern Frontend Apps with Mock APIs',
      category: 'Architecture',
      readTime: '3 min read',
      author: 'Leanne Graham',
      seed: 'Bret',
      gradient: 'from-purple-600 to-indigo-600',
    },
    {
      id: 2,
      title: 'Stateful Session Isolation Without a Real Database',
      category: 'Backend',
      readTime: '5 min read',
      author: 'Ervin Howell',
      seed: 'Antonette',
      gradient: 'from-cyan-600 to-blue-600',
    },
    {
      id: 3,
      title: 'Simulating Network Latency and Error Boundaries',
      category: 'DevTools',
      readTime: '4 min read',
      author: 'Clementine Bauch',
      seed: 'Samantha',
      gradient: 'from-pink-600 to-rose-600',
    },
    {
      id: 4,
      title: 'GraphQL Gateway & REST Unified Data Layer',
      category: 'GraphQL',
      readTime: '6 min read',
      author: 'Patricia Lebsack',
      seed: 'Karianne',
      gradient: 'from-amber-600 to-orange-600',
    },
  ];

  const sampleUsers = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: '@bret',
      email: 'Sincere@april.biz',
      seed: 'Bret',
      company: 'Romaguera-Crona',
      city: 'Gwenborough',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: '@antonette',
      email: 'Shanna@melissa.tv',
      seed: 'Antonette',
      company: 'Deckow-Crist',
      city: 'Wisokyburgh',
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: '@samantha',
      email: 'Nathan@yesenia.net',
      seed: 'Samantha',
      company: 'Romaguera-Jacobson',
      city: 'McKenziehaven',
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: '@karianne',
      email: 'Julianne.OConner@kory.org',
      seed: 'Karianne',
      company: 'Robel-Corkery',
      city: 'South Elvis',
    },
  ];

  const sampleProducts = [
    {
      id: 'local-prod-1',
      name: 'MacBook Pro M3 Max',
      price: '$3,499',
      category: 'Laptops',
      tag: 'Custom Schema',
      icon: 'ph:laptop-bold',
      gradient: 'from-slate-700 to-slate-900',
    },
    {
      id: 'local-prod-2',
      name: 'Sony WH-1000XM5 Headphones',
      price: '$399',
      category: 'Audio',
      tag: 'Custom Schema',
      icon: 'ph:headphones-bold',
      gradient: 'from-indigo-800 to-purple-900',
    },
    {
      id: 'local-prod-3',
      name: 'Keychron Q1 Pro Keyboard',
      price: '$199',
      category: 'Accessories',
      tag: 'Custom Schema',
      icon: 'ph:keyboard-bold',
      gradient: 'from-emerald-800 to-teal-900',
    },
    {
      id: 'local-prod-4',
      name: 'Ultra-Wide 34" Monitor',
      price: '$799',
      category: 'Displays',
      tag: 'Custom Schema',
      icon: 'ph:monitor-bold',
      gradient: 'from-amber-800 to-orange-900',
    },
  ];

  return (
    <section className="py-20 bg-bg-primary border-b border-border-theme space-y-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold font-mono">
            <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
            <span>Live Dataset Visual Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            See the Data in Action
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Explore live previews of our baseline datasets and dynamic custom collections rendered from realistic schemas.
          </p>
        </div>

        {/* 1. Live Posts Gallery */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
                <Icon icon="ph:newspaper-bold" className="w-6 h-6 text-accent-primary" />
                <span>Blog Posts Collection</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">100 baseline records + full-text search indexing</p>
            </div>

            {/* Terminal Request Bar */}
            <div className="flex items-center gap-2 bg-bg-secondary dark:bg-code-bg border border-border-theme px-3.5 py-2 rounded-xl font-mono text-xs text-emerald-700 dark:text-emerald-400 select-all">
              <span className="truncate">{postsUrl}</span>
              <button
                onClick={() => handleCopy(postsUrl, setCopiedPost)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0 ml-2"
                title="Copy URL"
              >
                <Icon icon={copiedPost ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {samplePosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-border-theme bg-bg-secondary overflow-hidden shadow-xs hover:border-accent-primary/50 transition-all group flex flex-col justify-between"
              >
                <div className={`h-28 bg-linear-to-br ${post.gradient} p-4 flex items-end justify-between text-white`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-xs">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-medium text-white/90">{post.readTime}</span>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <div className="pt-3 border-t border-border-theme flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent-light text-accent-primary text-[10px] font-bold flex items-center justify-center font-mono">
                        {post.seed.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-text-secondary font-medium">{post.author}</span>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted">#{post.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right">
            <Link
              href="/docs/posts"
              className="text-xs sm:text-sm font-bold text-accent-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View full Posts API documentation</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2. Live Users & SVG Avatars Gallery */}
        <div className="space-y-6 pt-6 border-t border-border-theme">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
                <Icon icon="ph:users-bold" className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span>Users & Dynamic SVG Avatars</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">Deterministic initials vectors and full address objects</p>
            </div>

            {/* Terminal Request Bar */}
            <div className="flex items-center gap-2 bg-bg-secondary dark:bg-code-bg border border-border-theme px-3.5 py-2 rounded-xl font-mono text-xs text-emerald-700 dark:text-emerald-400 select-all">
              <span className="truncate">{usersUrl}</span>
              <button
                onClick={() => handleCopy(usersUrl, setCopiedUser)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0 ml-2"
                title="Copy URL"
              >
                <Icon icon={copiedUser ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sampleUsers.map((user) => (
              <div
                key={user.id}
                className="p-5 rounded-2xl border border-border-theme bg-bg-secondary hover:border-indigo-500/50 transition-all space-y-4 shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {user.seed.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-text-primary truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-xs text-text-muted font-mono truncate">{user.username}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border-theme text-xs">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Email:</span>
                    <span className="font-mono text-text-muted truncate ml-2">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Company:</span>
                    <span className="font-medium text-text-primary truncate ml-2">{user.company}</span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Location:</span>
                    <span className="text-text-muted truncate ml-2">{user.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right">
            <Link
              href="/docs/users"
              className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View full Users & Avatars documentation</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. Live Custom Dynamic Schemas */}
        <div className="space-y-6 pt-6 border-t border-border-theme">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
                <Icon icon="ph:circles-three-plus-bold" className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                <span>Dynamic Custom Schemas (E-Commerce)</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">Create arbitrary tables on the fly without backend migrations</p>
            </div>

            {/* Terminal Request Bar */}
            <div className="flex items-center gap-2 bg-bg-secondary dark:bg-code-bg border border-border-theme px-3.5 py-2 rounded-xl font-mono text-xs text-emerald-700 dark:text-emerald-400 select-all">
              <span className="truncate">{customUrl}</span>
              <button
                onClick={() => handleCopy(customUrl, setCopiedProduct)}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0 ml-2"
                title="Copy URL"
              >
                <Icon icon={copiedProduct ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sampleProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-border-theme bg-bg-secondary overflow-hidden shadow-xs hover:border-pink-500/50 transition-all group flex flex-col justify-between"
              >
                <div className={`h-28 bg-linear-to-br ${prod.gradient} p-4 flex items-center justify-center text-white`}>
                  <Icon icon={prod.icon} className="w-10 h-10 text-white/90 group-hover:scale-110 transition-transform" />
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/20">
                        {prod.category}
                      </span>
                      <span className="font-mono text-base font-extrabold text-emerald-700 dark:text-emerald-400">{prod.price}</span>
                    </div>
                    <h4 className="font-bold text-sm text-text-primary group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors pt-1">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-border-theme flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>{prod.tag}</span>
                    <span className="text-text-secondary">{prod.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right">
            <Link
              href="/docs/custom"
              className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View full Custom Collections documentation</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
