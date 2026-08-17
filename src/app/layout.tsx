import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import '@/styles/globals.css';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CountsProvider } from '@/context/CountsContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';
import { getWebApiSchema } from '@/lib/json-ld';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import config from '@/config/env';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    types: {
      'text/plain': [
        { url: '/llms.txt', title: 'LLM Documentation' },
        { url: '/llms-full.txt', title: 'Full LLM Reference' },
      ],
      'application/json': [
        { url: '/product.json', title: 'Machine-Readable Product Manifest' },
      ],
    },
  },
  title: {
    default: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    template: `%s | Playground API`,
  },
  description:
    'Free, instant, stateful mock REST & GraphQL API sandbox for web & mobile development. Features persistent per-session CRUD mutation overlays, JWT auth loops, custom collections, and network latency simulation.',
  keywords: [
    'mock api',
    'fake api',
    'stateful mock api',
    'jsonplaceholder alternative',
    'platzi fake api alternative',
    'dummyjson alternative',
    'mock rest api',
    'mock graphql api',
    'fake rest api with auth',
    'persistent mock api',
    'api sandbox for react',
    'mock api for nextjs',
    'mock backend for flutter',
    'playwright mock api',
    'cypress test backend sandbox',
    'network delay simulation api',
    'dynamic custom collections api',
    'vector avatar generator api',
    'developer tools',
  ],
  authors: [{ name: 'Nilesh Kumar', url: 'https://nileshcodehub.github.io/' }],
  creator: 'Nilesh Kumar',
  publisher: 'Playground API',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'Free, zero-configuration, stateful mock REST & GraphQL API sandbox. Real persistent CRUD mutations, JWT authentication, and network simulation.',
    siteName: 'Playground API',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'Free, zero-configuration, stateful mock REST & GraphQL API sandbox for prototyping and automated tests.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getWebApiSchema();

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Documentation" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLM Reference Specification" />
        <link rel="alternate" type="application/json" href="/product.json" title="Product Manifest" />
      </head>
      <body
        suppressHydrationWarning
        className="flex flex-col min-h-screen antialiased selection:bg-accent-primary selection:text-white"
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <CountsProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CountsProvider>
        </ThemeProvider>

        <Suspense fallback={null}>
          <GoogleAnalytics gaId={config.googleAnalyticsId} />
        </Suspense>
      </body>
    </html>
  );
}
