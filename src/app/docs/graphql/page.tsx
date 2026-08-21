'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

const sampleQueries = [
  {
    name: 'Get Posts with Author Info',
    query: `query GetPosts {
  posts(limit: 5) {
    id
    title
    body
    user {
      id
      name
      email
    }
  }
}`,
  },
  {
    name: 'Get User with Posts & Comments',
    query: `query GetUserWithPosts {
  user(id: 1) {
    id
    name
    email
    posts {
      id
      title
      comments {
        id
        name
        body
      }
    }
  }
}`,
  },
  {
    name: 'Create Post Mutation',
    query: `mutation CreatePost {
  createPost(input: { title: "GraphQL Sandboxed Post", body: "Created via GraphiQL Explorer", user_id: 1 }) {
    id
    title
    body
    created_at
  }
}`,
  },
];

export default function GraphqlPage() {
  const [queryText, setQueryText] = useState(sampleQueries[0].query);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [timeMs, setTimeMs] = useState<number | null>(null);

  const graphqlUrl = `${config.apiUrl}/graphql`;

  const handleExecuteQuery = async () => {
    setLoading(true);
    const start = performance.now();

    try {
      const res = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryText }),
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setResult(data);
      setTimeMs(elapsed);
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setResult({ errors: [{ message: String(err) }] });
      setTimeMs(elapsed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/15 text-pink-500 text-xs sm:text-sm font-bold">
          <Icon icon="simple-icons:graphql" className="w-4 h-4" />
          GraphQL API Gateway & GraphiQL IDE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          GraphQL Sandbox Gateway
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Execute GraphQL queries and mutations against the unified gateway endpoint at <code className="font-mono text-pink-400">/api/v1/graphql</code>.
        </p>
      </div>

      {/* Preset Queries Bar */}
      <div id="preset-queries" data-toc-title="Preset Queries" className="space-y-2 scroll-mt-20">
        <span className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider">Preset GraphQL Queries:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sampleQueries.map((item) => (
            <button
              key={item.name}
              onClick={() => setQueryText(item.query)}
              className="px-3 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-semibold text-text-primary shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon="ph:magic-wand-bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GraphiQL Interactive IDE Container */}
      <div id="graphql-ide" data-toc-title="GraphiQL Interactive IDE" className="p-6 rounded-2xl glass-panel border border-border-theme space-y-6 shadow-2xl scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-text-secondary">
            <span className="text-pink-400 font-bold">POST</span>
            <span>{graphqlUrl}</span>
          </div>
          <button
            onClick={handleExecuteQuery}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-sans text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Icon icon={loading ? 'ph:spinner-bold' : 'ph:play-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Executing...' : 'Execute Query'}</span>
          </button>
        </div>

        {/* Code Query Input & Result Viewer Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col h-full space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">GraphQL Query Editor</label>
              <span className="text-xs sm:text-sm font-mono text-text-muted">Interactive</span>
            </div>
            <CodeBlock
              code={queryText}
              language="graphql"
              title="Query Source"
              minHeight="min-h-[350px]"
              maxHeight="max-h-[420px]"
              className="flex-1 flex flex-col"
            />
          </div>

          <div className="flex flex-col h-full space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">GraphQL JSON Output</label>
              {timeMs !== null && (
                <span className="text-xs sm:text-sm font-mono text-text-muted flex items-center gap-1">
                  <Icon icon="ph:timer-bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-primary" />
                  {timeMs} ms
                </span>
              )}
            </div>
            <CodeBlock
              code={result ? result : '# Hit Execute Query to run GraphQL query'}
              language="json"
              title="JSON Output"
              minHeight="min-h-[350px]"
              maxHeight="max-h-[420px]"
              className="flex-1 flex flex-col"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
