import { siteConfig } from '@/config/site';

export function getWebApiSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteConfig.url}/#webapp`,
        url: siteConfig.url,
        name: siteConfig.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        description: siteConfig.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'WebAPI',
        '@id': `${siteConfig.url}/#webapi`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        documentation: `${siteConfig.url}/docs`,
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

