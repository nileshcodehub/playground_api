import type { Metadata } from 'next';
import '@/styles/globals.css';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CountsProvider } from '@/context/CountsContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';
import { getWebApiSchema } from '@/lib/json-ld';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    types: {
      'text/plain': [
        { url: '/llms.txt', title: 'LLM Documentation' },
        { url: '/llms-full.txt', title: 'Full LLM Reference' },
      ],
    },
  },
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  keywords: [
    'mock api',
    'fake api',
    'jsonplaceholder alternative',
    'platzi fake api alternative',
    'rest api mock',
    'graphql mock gateway',
    'sandbox api',
    'frontend mock api',
    'developer tools',
    'api testing',
    'stateful mock api',
  ],
  authors: [{ name: 'Nilesh Kumar' }],
  creator: 'Nilesh Kumar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
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
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
    </html>
  );
}

