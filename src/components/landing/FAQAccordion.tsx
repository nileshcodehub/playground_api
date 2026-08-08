'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { getFaqSchema } from '@/lib/json-ld';

const faqs = [
  {
    question: 'Is Playground API completely free to use?',
    answer: 'Yes! Playground API is 100% free and open-source. No credit card, registration, or API key is required to start prototyping.',
  },
  {
    question: 'How do persistent sandboxed mutations work without mutating seed data?',
    answer: 'When you make a POST, PUT, PATCH, or DELETE request, Playground API generates or reads a signed identity token in your cookie (pg_identity) or header (X-Playground-Identity). Your mutations are saved to an isolated overlay table for your session identity. Shared global seed records remain untouched for all other visitors!',
  },
  {
    question: 'How do I test network latency or server errors in my frontend app?',
    answer: 'Simply include middleware simulation headers in your requests: X-Simulate-Delay: 1500 delays responses by 1500ms, and X-Simulate-Status: 500 simulates an internal server error response for testing loading spinners and error boundaries.',
  },
  {
    question: 'Can I export or import my session sandbox state?',
    answer: 'Yes! Navigate to the Snapshot Export & Import tool (/docs/export-import) to download your full session sandbox state as a JSON file or restore a previous snapshot for E2E testing setups and team sharing.',
  },
  {
    question: 'What happens to my sandboxed records after 10 days of inactivity?',
    answer: 'Inactive session identities and associated overlay records are automatically cleaned up after 10 days of inactivity by an automated background cron job.',
  },
  {
    question: 'Does Playground API support GraphQL queries and mutations?',
    answer: 'Yes! Playground API features a unified GraphQL gateway at /api/v1/graphql where you can execute queries, mutations, and relational graph selections powered by the overlayService.',
  },
  {
    question: 'How does JWT authentication simulation work?',
    answer: 'Send a POST request to /api/v1/auth/login with any username/password to receive a fake JWT Bearer token. Use Authorization: Bearer <token> to fetch profile details at /api/v1/auth/me.',
  },
  {
    question: 'Can I create dynamic custom collection endpoints like /custom/products?',
    answer: 'Yes! Hit any route under /api/v1/custom/:resource to automatically create, fetch, update, or delete custom prototype entities.',
  },
  {
    question: 'How can I download OpenAPI, Postman, Bruno, or TypeScript SDK specs?',
    answer: 'Visit the API Collections section in the docs (/docs/collections/openapi) to download 1-click collections for Postman, Bruno, Insomnia, OpenAPI 3.0, and TypeScript .d.ts files.',
  },
  {
    question: 'Is API versioning supported for future upgrades?',
    answer: 'Yes! All current REST and GraphQL endpoints are prefixed with /api/v1/. Future v2 releases will be added alongside v1 to maintain strict backwards compatibility.',
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqLd = getFaqSchema(faqs);

  return (
    <section className="py-20 bg-bg-primary border-b border-border-theme">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold">
            <Icon icon="ph:question-bold" className="w-4 h-4" />
            10 Common Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Everything you need to know about Playground API architecture and integration.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className="rounded-2xl glass-panel overflow-hidden transition-all border border-border-theme"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <Icon
                    icon="ph:caret-down-bold"
                    className={`w-4 h-4 text-accent-primary transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border-theme/50 bg-bg-secondary/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
