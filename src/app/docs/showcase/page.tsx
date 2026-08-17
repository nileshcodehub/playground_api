import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export const metadata = {
  title: 'Real-World Project Showcase',
  description: 'Explore live applications, React demo stores, and architectural recipes built with Playground API.',
};

export default function ShowcasePage() {
  const sampleReactIntegration = `// Example from playground_api_react_demo
import { useState, useEffect } from 'react';

export function useProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dynamic products with persistent sandbox overlay
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('${config.publicApiUrl}/custom/products?_sort=createdAt&_order=desc', {
        credentials: 'include',
      });
      const data = await res.json();
      setProducts(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  // 2. Create a new custom product (Persists in user session!)
  const addProduct = async (productData) => {
    const res = await fetch('${config.publicApiUrl}/custom/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      await fetchProducts(); // Refresh list to see the newly created item
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, addProduct };
}`;

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* 1. Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
          <Icon icon="ph:rocket-launch-bold" className="w-4 h-4" />
          Real-World Applications & Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Built with Playground API
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          See how developers use Playground API to build full-stack frontends, stateful mock stores, and automated test suites with zero backend infrastructure.
        </p>
      </div>

      {/* 2. Featured Official Project: React E-Commerce Demo */}
      <div id="featured-demo" className="p-6 sm:p-8 rounded-3xl glass-panel border border-accent-primary/40 bg-linear-to-b from-accent-light/10 via-bg-secondary to-bg-secondary space-y-6 scroll-mt-20 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-theme/70 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary text-white text-xs font-bold shadow-xs">
              <Icon icon="ph:star-fill" className="w-3.5 h-3.5" />
              <span>Official Featured App</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              Playground React E-Commerce Store & Studio
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
              A production-ready React 18 e-commerce application featuring product catalog management, interactive cart drawer, JWT authentication, and isolated session sandbox mutations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/docs/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
              <span>Try in API Studio</span>
            </Link>
            <a
              href="https://github.com/nileshcodehub/playground_api/tree/main/playground_api_react_demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-tertiary hover:bg-border-theme border border-border-theme text-text-primary text-xs sm:text-sm font-bold transition-all"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-bg-tertiary/70 border border-border-theme space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Icon icon="ph:shopping-bag-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-text-primary text-sm">Dynamic Products</h3>
            <p className="text-xs text-text-secondary leading-tight">
              Uses <code className="font-mono text-accent-primary">/custom/products</code> to allow users to add, edit, and delete products that persist on page reload.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-bg-tertiary/70 border border-border-theme space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Icon icon="ph:shopping-cart-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-text-primary text-sm">Cart & Checkout</h3>
            <p className="text-xs text-text-secondary leading-tight">
              Real-time cart drawer with automatic total calculation and mock order submission.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-bg-tertiary/70 border border-border-theme space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Icon icon="ph:lock-key-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-text-primary text-sm">JWT Auth Flow</h3>
            <p className="text-xs text-text-secondary leading-tight">
              Login via <code className="font-mono text-accent-primary">/auth/login</code> and load protected account profiles using access tokens.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-bg-tertiary/70 border border-border-theme space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <Icon icon="ph:timer-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-text-primary text-sm">Loading Skeletons</h3>
            <p className="text-xs text-text-secondary leading-tight">
              Tests skeleton loaders seamlessly with <code className="font-mono text-accent-primary">?_delay=1500</code>.
            </p>
          </div>
        </div>

        {/* Integration Code Sample */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            How the React Demo Integrates with Playground API:
          </span>
          <CodeBlock
            code={sampleReactIntegration}
            language="javascript"
            title="playground_api_react_demo/src/hooks/useProducts.js"
          />
        </div>
      </div>

      {/* 3. Real-World Architecture Patterns */}
      <div id="architecture-patterns" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-black text-text-primary">
          Common Use-Case Architecture Blueprints
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-border-theme bg-bg-secondary space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Icon icon="simple-icons:nextdotjs" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Next.js 15 Server Actions</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Build full-stack server-side rendered blogs with optimistic UI updates and zero database migrations.
            </p>
            <div className="p-2.5 rounded-lg bg-bg-tertiary font-mono text-[11px] text-text-muted">
              POST /api/v1/posts $\rightarrow$ revalidatePath(&apos;/&apos;)
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border-theme bg-bg-secondary space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Icon icon="simple-icons:vuedotjs" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Vue 3 / Pinia Kanban Board</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Manage interactive todo task boards with drag-and-drop status changes using <code className="font-mono">PATCH /todos/:id</code>.
            </p>
            <div className="p-2.5 rounded-lg bg-bg-tertiary font-mono text-[11px] text-text-muted">
              PATCH /api/v1/todos/1 &#123; completed: true &#125;
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border-theme bg-bg-secondary space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Icon icon="simple-icons:playwright" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Automated CI/CD Test Fixtures</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Export sandbox state to JSON snapshots and load deterministic fixtures into Playwright or Cypress runs.
            </p>
            <div className="p-2.5 rounded-lg bg-bg-tertiary font-mono text-[11px] text-text-muted">
              POST /api/v1/session/import &#123; snapshot &#125;
            </div>
          </div>
        </div>
      </div>

      {/* 4. Community Submissions */}
      <div id="community-submissions" className="p-8 rounded-2xl glass-panel border border-border-theme text-center space-y-4 scroll-mt-20">
        <div className="w-14 h-14 rounded-2xl bg-accent-light text-accent-primary flex items-center justify-center mx-auto">
          <Icon icon="ph:sparkle-bold" className="w-7 h-7" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-text-primary">Submit Your Project</h3>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Have you built a React, Vue, Svelte, or Mobile tutorial or application using Playground API? Open a pull request or issue on GitHub to be featured here!
        </p>
        <a
          href="https://github.com/nileshcodehub/playground_api/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs sm:text-sm font-bold transition-all shadow-md"
        >
          <Icon icon="simple-icons:github" className="w-4 h-4" />
          <span>Submit Project on GitHub</span>
        </a>
      </div>
    </div>
  );
}
