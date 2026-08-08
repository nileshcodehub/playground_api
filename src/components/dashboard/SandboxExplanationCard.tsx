import React from 'react';
import { Icon } from '@iconify/react';

export function SandboxExplanationCard() {
  return (
    <div className="p-6 rounded-2xl glass-panel border border-border-theme space-y-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-border-theme pb-4">
        <div className="text-2xl pt-0.5">💡</div>
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
            How Session Sandboxing Works
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Stateful mock API testing without account registration or logins
          </p>
        </div>
      </div>

      {/* 3 Step List */}
      <div className="space-y-5">
        {/* Step 1 */}
        <div className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            1
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-text-primary">
              Automatic HMAC Identity Issuance
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              On your very first request, the server generates a cryptographically signed{' '}
              <strong className="text-text-primary">HMAC-SHA256 identity token</strong> issued via an HTTP-only cookie (<code className="font-mono text-accent-primary">pg_identity</code>) or <code className="font-mono text-accent-primary">X-Playground-Identity</code> header. No sign-up or API key is required.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            2
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-text-primary">
              Session Overlay Mutations
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              When you issue POST, PUT, PATCH, or DELETE requests, your mutations are recorded into a private session sandbox (<code className="font-mono text-accent-primary">overlay_records</code>). Shared global seed data remains untouched for all other developers.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            3
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-text-primary">
              Virtual Merging Engine
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Subsequent GET requests run through our Virtual Merging Engine. Your newly created records appear at the top, updates overlay in-place, and deleted items are filtered out specifically for your active session.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="p-3.5 rounded-xl bg-bg-tertiary border border-border-theme flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-text-secondary font-medium">
        <span className="flex items-center gap-2">
          <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-400" />
          Quota: 30 custom created records per resource
        </span>
        <span className="flex items-center gap-2">
          <Icon icon="ph:hourglass-medium-bold" className="w-4 h-4 text-amber-400" />
          Retention: 10-day inactivity cleanup
        </span>
      </div>
    </div>
  );
}
