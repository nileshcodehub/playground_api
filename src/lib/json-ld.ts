import { siteConfig } from '@/config/site';

export function getWebApiSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: 'Playground API',
        alternateName: ['Playground Mock API', 'PlaygroundAPI', 'JSONPlaceholder Alternative with Persistence'],
        description: siteConfig.description,
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteConfig.url}/#software`,
        name: 'Playground API',
        url: siteConfig.url,
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'Mock API & API Prototyping Sandbox',
        operatingSystem: 'Any',
        description:
          'Free, zero-configuration, stateful mock REST and GraphQL API sandbox for frontend developers, mobile testing, and AI coding agents. Mutations persist across sessions with zero setup.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          name: siteConfig.author.name,
          url: siteConfig.author.website,
        },
        softwareVersion: '1.0.0',
        license: 'https://opensource.org/licenses/MIT',
      },
      {
        '@type': 'WebAPI',
        '@id': `${siteConfig.url}/#webapi`,
        name: 'Playground API (v1)',
        description: siteConfig.description,
        url: siteConfig.url,
        documentation: `${siteConfig.url}/docs`,
        termsOfService: `${siteConfig.url}/docs/introduction`,
        provider: {
          '@type': 'Organization',
          name: 'Playground API',
          url: siteConfig.url,
        },
      },
    ],
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
