import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

interface CollectionsPageProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return [
    { type: 'openapi' },
    { type: 'postman' },
    { type: 'bruno' },
    { type: 'insomnia' },
    { type: 'typescript' },
  ];
}

const collectionMeta: Record<
  string,
  {
    title: string;
    subtitle: string;
    overview: string;
    icon: string;
    downloadUrl: string;
    format: string;
    benefits: string[];
    gettingStarted: string[];
    codeSnippet: string;
    prevPage?: { title: string; href: string };
    nextPage?: { title: string; href: string };
  }
> = {
  postman: {
    title: 'Postman',
    subtitle: 'Postman Collection (v2.1)',
    overview:
      'Postman is a powerful API client that simplifies the process of testing, documenting, and sharing APIs. It provides an intuitive interface for sending requests, viewing responses, and automating workflows through collections.',
    icon: 'simple-icons:postman',
    downloadUrl: `${config.apiUrl}/downloads/postman.json`,
    format: 'JSON (Postman v2.1)',
    benefits: [
      'Explore our full REST & GraphQL API capabilities instantly.',
      'Test different endpoints with pre-configured requests and sample parameters.',
      'Understand request headers, query filters, and response JSON formats.',
      'Quickly integrate Playground API endpoints into your frontend applications.',
    ],
    gettingStarted: [
      'Download and install Postman desktop or web client if you haven\'t already.',
      'Download our Postman collection by clicking the link below.',
      'In Postman, click "Import" in the top left and select the downloaded JSON file.',
      `In Environment variables, set API_URL to ${config.apiUrl}.`,
      'Start exploring and sending requests to our mock API endpoints!',
    ],
    codeSnippet: `// Postman Environment Variable Setup
baseUrl: ${config.apiUrl}
pg_identity: <your_signed_session_token>`,
    prevPage: { title: 'OpenAPI 3.0 Spec', href: '/docs/collections/openapi' },
    nextPage: { title: 'Bruno Collection', href: '/docs/collections/bruno' },
  },

  openapi: {
    title: 'OpenAPI 3.0',
    subtitle: 'OpenAPI 3.0 Specification (Swagger)',
    overview:
      'OpenAPI 3.0 is the industry-standard specification language for HTTP REST APIs. It allows developers to generate interactive Swagger UI documentation, client SDKs, and mock servers automatically.',
    icon: 'simple-icons:openapi',
    downloadUrl: `${config.apiUrl}/downloads/openapi.json`,
    format: 'JSON (OpenAPI 3.0)',
    benefits: [
      'View interactive endpoint schemas and parameters in Swagger UI or Redoc.',
      'Auto-generate strongly typed client SDKs in TypeScript, Python, Swift, or Rust.',
      'Validate request and response JSON schemas programmatically.',
      'Import directly into backend proxies and API gateways.',
    ],
    gettingStarted: [
      'Download our OpenAPI 3.0 specification file by clicking the link below.',
      'Open Swagger Editor, Redoc, or Stoplight Studio.',
      'Import the JSON file to view full interactive documentation.',
      'Use openapi-generator-cli to generate client code for your project.',
    ],
    codeSnippet: `npx @openapitools/openapi-generator-cli generate \\
  -i ${config.apiUrl}/downloads/openapi.json \\
  -g typescript-axios \\
  -o ./src/api-client`,
    prevPage: { title: 'GraphQL Gateway', href: '/docs/graphql' },
    nextPage: { title: 'Postman Collection', href: '/docs/collections/postman' },
  },

  bruno: {
    title: 'Bruno',
    subtitle: 'Bruno Collection Spec',
    overview:
      'Bruno is an open-source, offline-first API client designed as a modern Git-friendly alternative to Postman. It stores collection files directly in your repository format.',
    icon: 'ph:brackets-curly-bold',
    downloadUrl: `${config.apiUrl}/downloads/bruno.json`,
    format: 'JSON (Bruno Spec)',
    benefits: [
      'Offline-first execution without cloud sync requirements.',
      'Git-friendly plain text collection files.',
      'Pre-configured request variables for local identity sandboxing.',
    ],
    gettingStarted: [
      'Download and launch the Bruno desktop application.',
      'Download our Bruno collection file below.',
      'Click "Open Collection" and select the downloaded JSON file.',
      'Start testing Playground API endpoints offline!',
    ],
    codeSnippet: `bru import --source ${config.apiUrl}/downloads/bruno.json`,
    prevPage: { title: 'Postman Collection', href: '/docs/collections/postman' },
    nextPage: { title: 'Insomnia Collection', href: '/docs/collections/insomnia' },
  },

  insomnia: {
    title: 'Insomnia',
    subtitle: 'Insomnia Workspace Export',
    overview:
      'Insomnia is a popular open-source API design and testing platform. Import our workspace definition to test endpoints with environment variable switching.',
    icon: 'simple-icons:insomnia',
    downloadUrl: `${config.apiUrl}/downloads/insomnia.json`,
    format: 'JSON (Insomnia v4)',
    benefits: [
      'Clean modern interface for REST and GraphQL testing.',
      'Built-in JSON schema validation and environment management.',
      'Pre-configured authorization headers and sandbox identity cookies.',
    ],
    gettingStarted: [
      'Open the Insomnia desktop application.',
      'Go to Preferences -> Data -> Import Data -> From File.',
      'Select the downloaded Insomnia JSON file.',
      'Begin testing your sandbox endpoints!',
    ],
    codeSnippet: `# Import directly inside Insomnia Preferences -> Data`,
    prevPage: { title: 'Bruno Collection', href: '/docs/collections/bruno' },
    nextPage: { title: 'TypeScript SDK (.d.ts)', href: '/docs/collections/typescript' },
  },

  typescript: {
    title: 'TypeScript SDK',
    subtitle: 'TypeScript Type Declarations (.d.ts)',
    overview:
      'Strongly typed interface declarations for Posts, Users, Comments, Todos, Auth, and Custom payload schemas for full auto-complete in VS Code.',
    icon: 'simple-icons:typescript',
    downloadUrl: `${config.apiUrl}/types/ts`,
    format: 'TypeScript (.d.ts)',
    benefits: [
      'Full TypeScript IntelliSense auto-complete in VS Code and IDEs.',
      'Eliminates type errors when sending POST/PUT payloads to Playground API.',
      'Includes Post, Comment, User, Todo, and Auth payload interfaces.',
    ],
    gettingStarted: [
      'Download playground-api.d.ts file below.',
      'Save the file in your project under src/types/playground-api.d.ts.',
      'Ensure tsconfig.json includes "src/**/*.d.ts" in the include array.',
      'Import types into your React/Next.js components!',
    ],
    codeSnippet: `import { Post, User, AuthPayload } from './types/playground-api';

const post: Post = {
  id: 'local-123',
  title: 'Typed Sandbox Post',
  body: 'Full type safety!',
  user_id: 1
};`,
    prevPage: { title: 'Insomnia Collection', href: '/docs/collections/insomnia' },
  },
};

export async function generateMetadata({ params }: CollectionsPageProps) {
  const { type } = await params;
  const item = collectionMeta[type];
  if (!item) return { title: 'Collection Not Found' };
  return { title: item.title, description: item.overview };
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const { type } = await params;
  const item = collectionMeta[type];

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-10 w-full max-w-none">
      {/* 1. Page Title */}
      <div className="space-y-3 border-b border-border-theme pb-6">
        <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">{item.title}</h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{item.subtitle}</p>
      </div>

      {/* 2. Overview Section */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Overview</h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{item.overview}</p>
      </div>

      {/* 3. Using Our Collection Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Using Our {item.title} Collection
        </h2>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          We&apos;ve prepared a comprehensive {item.title} collection that includes all available endpoints in our API, properly organized and documented. This collection will help you:
        </p>

        <ol className="space-y-2 text-sm sm:text-base text-text-secondary pl-5 list-decimal font-medium">
          {item.benefits.map((b, i) => (
            <li key={i} className="leading-relaxed">
              <span className="text-text-primary font-semibold">{b}</span>
            </li>
          ))}
        </ol>

        {/* Client Preview Card Box */}
        <CodeBlock
          code={item.codeSnippet}
          title={`${item.title} Workspace Preview`}
          subtitle={`GET ${item.downloadUrl}`}
          icon={item.icon}
          className="shadow-xl"
        />
      </div>

      {/* 4. Getting Started Instructions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Getting Started</h2>
        <ol className="space-y-3 text-sm sm:text-base text-text-secondary pl-5 list-decimal font-medium">
          {item.gettingStarted.map((step, idx) => (
            <li key={idx} className="leading-relaxed">
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* Download Button Link */}
        <div className="pt-3">
          <a
            href={item.downloadUrl}
            target="_blank"
            download
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            <Icon icon="ph:download-simple-bold" className="w-4 h-4 sm:w-5 sm:h-5" />
            Download {item.title} Collection
          </a>
        </div>
      </div>

      {/* 5. Next / Prev Navigation Links */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        {item.prevPage ? (
          <Link
            href={item.prevPage.href}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group"
          >
            <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
            <span>Prev: {item.prevPage.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {item.nextPage && (
          <Link
            href={item.nextPage.href}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm font-bold text-text-primary transition-all group ml-auto"
          >
            <span>Next: {item.nextPage.title}</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
