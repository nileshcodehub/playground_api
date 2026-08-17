import config from './env';

export const siteConfig = {
  name: 'Playground API',
  title: 'Playground API — Free Sandboxed Mock REST & GraphQL Service',
  description:
    'Free, instant, sandboxed mock REST and GraphQL API for prototyping and testing. Features persistent per-identity overlays, JWT auth, custom collections, and dynamic image avatars.',
  url: config.siteUrl,
  apiUrl: config.apiUrl,
  apiVersion: config.apiVersion,
  versionBadge: 'v1.0.0',
  githubUrl: 'https://github.com/nileshcodehub/playground_api',
  author: {
    name: 'Nilesh Kumar',
    website: 'https://nileshcodehub.github.io/',
    github: 'https://github.com/nileshcodehub',
  },
  healthUrl: `${config.apiUrl}/health`,
  llmsUrl: '/llms.txt',
  llmsFullUrl: '/llms-full.txt',

  navLinks: [
    { label: 'Overview', href: '/docs/introduction', icon: 'ph:info-bold' },
    { label: 'Quickstart', href: '/docs/quickstart', icon: 'ph:lightning-fill' },
    { label: 'API Studio', href: '/docs/studio', icon: 'ph:code-bold' },
    { label: 'Collections', href: '/docs/collections/openapi', icon: 'ph:folders-bold' },
    { label: 'GraphQL', href: '/docs/graphql', icon: 'simple-icons:graphql' },
  ],

  nestedSidebarGroups: [
    {
      title: 'Getting Started',
      icon: 'ph:rocket-launch-bold',
      items: [
        { title: 'Overview', href: '/docs/introduction', icon: 'ph:sparkle-bold' },
        { title: '30-Second Quickstart', href: '/docs/quickstart', icon: 'ph:lightning-fill' },
        { title: 'How Sandboxing Works', href: '/docs/how-it-works', icon: 'ph:shield-check-bold' },
        { title: 'Framework Recipes', href: '/docs/recipes', icon: 'ph:code-bold' },
      ],
    },
    {
      title: 'Features & Sandbox Tools',
      icon: 'ph:gear-six-bold',
      items: [
        { title: 'Interactive API Studio', href: '/docs/studio', icon: 'ph:play-circle-bold' },
        { title: 'Network & Chaos Simulation', href: '/docs/simulation', icon: 'ph:timer-bold' },
        { title: 'Snapshot Import & Export', href: '/docs/export-import', icon: 'ph:cloud-arrow-up-bold' },
        { title: 'Session Quotas & Stats', href: '/docs/stats', icon: 'ph:chart-bar-bold' },
        { title: 'Project Showcase', href: '/docs/showcase', icon: 'ph:rocket-launch-bold' },
      ],
    },
    {
      title: 'REST API Collections',
      icon: 'ph:tree-structure-bold',
      items: [
        { title: 'Posts Collection', href: '/docs/posts', badge: '100 items', icon: 'ph:newspaper-bold' },
        { title: 'Comments Collection', href: '/docs/comments', badge: '300 items', icon: 'ph:chat-circle-text-bold' },
        { title: 'Users Collection', href: '/docs/users', badge: '25 items', icon: 'ph:users-bold' },
        { title: 'Todos Collection', href: '/docs/todos', badge: '125 items', icon: 'ph:check-square-offset-bold' },
        { title: 'Authentication (JWT)', href: '/docs/auth', badge: 'Auth', icon: 'ph:lock-key-bold' },
        { title: 'Custom Collections', href: '/docs/custom', badge: 'Dynamic', icon: 'ph:circles-three-plus-bold' },
        { title: 'Media & Avatars', href: '/docs/avatars', badge: 'SVG', icon: 'ph:user-circle-gear-bold' },
      ],
    },
    {
      title: 'GraphQL API Gateway',
      icon: 'simple-icons:graphql',
      items: [
        { title: 'GraphiQL IDE & Explorer', href: '/docs/graphql', icon: 'ph:planet-bold' },
        { title: 'Posts GraphQL Schema', href: '/docs/graphql/posts', icon: 'ph:newspaper-bold' },
        { title: 'Comments GraphQL Schema', href: '/docs/graphql/comments', icon: 'ph:chat-circle-text-bold' },
        { title: 'Users GraphQL Schema', href: '/docs/graphql/users', icon: 'ph:users-bold' },
        { title: 'Todos GraphQL Schema', href: '/docs/graphql/todos', icon: 'ph:check-square-offset-bold' },
        { title: 'Auth GraphQL Schema', href: '/docs/graphql/auth', icon: 'ph:lock-key-bold' },
      ],
    },
    {
      title: 'API Downloads & Specs',
      icon: 'ph:download-simple-bold',
      items: [
        { title: 'OpenAPI 3.0 Spec', href: '/docs/collections/openapi', icon: 'simple-icons:openapi' },
        { title: 'Postman Collection', href: '/docs/collections/postman', icon: 'simple-icons:postman' },
        { title: 'Bruno Collection', href: '/docs/collections/bruno', icon: 'ph:brackets-curly-bold' },
        { title: 'Insomnia Collection', href: '/docs/collections/insomnia', icon: 'simple-icons:insomnia' },
        { title: 'TypeScript SDK (.d.ts)', href: '/docs/collections/typescript', icon: 'simple-icons:typescript' },
      ],
    },
  ],
};
