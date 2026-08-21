import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const metadata = {
  title: 'HTTP Status Codes & Errors',
  description: 'Understand Playground API HTTP status codes, error payload schemas, and client handling.',
};

export default function ErrorsPage() {
  const errorJson = `{
  "status": 404,
  "error": "Not Found",
  "message": "Post with ID 999 does not exist in baseline or session overlay.",
  "timestamp": "2026-08-18T00:00:00.000Z"
}`;

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          HTTP Status Codes & Errors
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API returns standard HTTP status codes and consistent JSON error responses across all REST and custom endpoints.
        </p>
      </div>

      {/* 2. Status Codes Table */}
      <div id="status-codes" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Supported HTTP Status Codes
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-theme bg-bg-tertiary/40 text-text-muted font-semibold">
                <th className="p-3">Status</th>
                <th className="p-3 font-sans">Meaning</th>
                <th className="p-3 font-sans">Trigger Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">200 OK</td>
                <td className="p-3 font-sans text-text-primary">Success</td>
                <td className="p-3 font-sans">GET requests and successful updates (PUT/PATCH).</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">201 Created</td>
                <td className="p-3 font-sans text-text-primary">Resource Created</td>
                <td className="p-3 font-sans">Successful POST create requests. Returns the new item with ID.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-600 dark:text-slate-400">204 No Content</td>
                <td className="p-3 font-sans text-text-primary">Resource Deleted</td>
                <td className="p-3 font-sans">Successful DELETE requests. Empty body returned.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400">400 Bad Request</td>
                <td className="p-3 font-sans text-text-primary">Client Error</td>
                <td className="p-3 font-sans">Malformed JSON body or missing required fields.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">401 Unauthorized</td>
                <td className="p-3 font-sans text-text-primary">Missing / Invalid Token</td>
                <td className="p-3 font-sans">Missing Bearer token on protected /auth/me routes.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">404 Not Found</td>
                <td className="p-3 font-sans text-text-primary">Resource Missing</td>
                <td className="p-3 font-sans">Requested ID does not exist or has been deleted.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-purple-600 dark:text-purple-400">500 Server Error</td>
                <td className="p-3 font-sans text-text-primary">Internal Error</td>
                <td className="p-3 font-sans">Simulated with ?_status=500 for testing error boundaries.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Standard Error Format */}
      <div id="error-payload" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Standard JSON Error Response
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          When an error occurs, the server responds with a consistent JSON schema:
        </p>
        <CodeBlock code={errorJson} language="json" title="errorResponse.json" />
      </div>
    </div>
  );
}
