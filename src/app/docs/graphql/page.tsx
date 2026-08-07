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
      <div className="space-y-3 border-b border-border-theme pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/15 text-pink-500 text-xs font-bold">
          <Icon icon="simple-icons:graphql" className="w-4 h-4" />
          GraphQL API Gateway & GraphiQL IDE
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          GraphQL Sandbox Gateway
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Execute GraphQL queries and mutations against the unified gateway endpoint at <code className="font-mono text-pink-400">/api/v1/graphql</code>.
        </p>
      </div>

      {/* Preset Queries Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Preset GraphQL Queries:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sampleQueries.map((item) => (
            <button
              key={item.name}
              onClick={() => setQueryText(item.query)}
              className="px-3 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs font-semibold text-text-primary shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon="ph:magic-wand-bold" className="w-3.5 h-3.5 text-pink-400" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GraphiQL Interactive IDE Container */}
      <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
            <span className="text-pink-400 font-bold">POST</span>
            <span>{graphqlUrl}</span>
          </div>
          <button
            onClick={handleExecuteQuery}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-sans text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Icon icon={loading ? 'ph:spinner-bold' : 'ph:play-bold'} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Executing...' : 'Execute Query'}</span>
          </button>
        </div>

        {/* Code Query Input & Result Viewer Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">GraphQL Query Editor</label>
            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              rows={14}
              className="w-full font-mono text-xs p-4 rounded-xl bg-code-bg border border-border-theme text-gray-200 focus:outline-none focus:border-pink-500 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">GraphQL JSON Output</label>
              {timeMs !== null && (
                <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                  <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
                  {timeMs} ms
                </span>
              )}
            </div>
            <CodeBlock
              code={result ? result : '# Hit Execute Query to run GraphQL query'}
              language="json"
              maxHeight="max-h-[350px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
