import React from 'react';
import { Icon } from '@iconify/react';

export function CompareTable() {
  return (
    <section className="py-20 bg-bg-secondary border-b border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent-primary text-xs font-bold">
            Comprehensive Platform Matrix
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            How Playground API Compares to Alternatives
          </h2>
          <p className="text-sm text-text-secondary">
            See why developers choose Playground API over legacy mock APIs for real-world prototyping.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-theme glass-panel shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-theme font-bold text-text-primary">
                <th className="p-4">Feature / Capability</th>
                <th className="p-4 text-accent-primary font-extrabold text-sm">Playground API</th>
                <th className="p-4 text-text-secondary">JSONPlaceholder</th>
                <th className="p-4 text-text-secondary">Platzi Fake API</th>
                <th className="p-4 text-text-secondary">DummyJSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              <tr>
                <td className="p-4 font-semibold text-text-primary">Persistent Per-Session Mutation Overlays</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Real Virtual State
                </td>
                <td className="p-4 text-rose-400">❌ Fake Payload Echo</td>
                <td className="p-4 text-rose-400">❌ Fake Payload Echo</td>
                <td className="p-4 text-rose-400">❌ Fake Payload Echo</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">GraphQL Gateway Support</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Yes (/graphql)
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-emerald-400">✅ Yes</td>
                <td className="p-4 text-rose-400">❌ No</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">Fake JWT Auth Simulation</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Full Bearer Auth
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-emerald-400">✅ Yes</td>
                <td className="p-4 text-emerald-400">✅ Yes</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">Dynamic Custom Collections</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Yes (/custom/*)
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">Network Delay & Error Headers</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Headers & Params
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-amber-400">⚠️ Limited</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">Session Snapshot Export / Import</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Portable JSON
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">Relational Sub-Resource Filtering</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Full Support
                </td>
                <td className="p-4 text-emerald-400">✅ Basic</td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-emerald-400">✅ Basic</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">AI Readable (/llms.txt) Specification</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> Yes
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-primary">One-Click Multi-Format Spec Downloads</td>
                <td className="p-4 font-bold text-emerald-400 flex items-center gap-1">
                  <Icon icon="ph:check-circle-fill" className="w-4 h-4" /> 5+ Formats
                </td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
                <td className="p-4 text-rose-400">❌ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
