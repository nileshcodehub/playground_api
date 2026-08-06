import { siteConfig } from '@/config/site';

export function getWebApiSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebAPI',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    documentation: `${siteConfig.url}/docs`,
    termsOfService: `${siteConfig.url}/terms`,
    provider: {
      '@type': 'Organization',
      name: 'Playground API',
      url: siteConfig.url,
    },
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
