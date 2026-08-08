import { NextResponse } from 'next/server';
import config from '@/config/env';
import { apiCatalog } from '@/config/api-catalog';

export async function GET() {
  const publicApi = config.publicApiUrl || config.apiUrl;
  let fullText = `# Playground API — Full AI Technical Reference Specification

Base API Endpoint: ${publicApi}
Documentation Site: ${config.siteUrl}
Version: ${config.apiVersion}

`;

  apiCatalog.forEach((resource) => {
    fullText += `## Resource: ${resource.name}\n`;
    fullText += `Description: ${resource.description}\n`;
    fullText += `Base Path: ${resource.baseUrl}\n\n`;

    resource.endpoints.forEach((ep) => {
      fullText += `### ${ep.method} ${ep.path}\n`;
      fullText += `Title: ${ep.title}\n`;
      fullText += `Description: ${ep.description}\n`;
      if (ep.queryParams && ep.queryParams.length > 0) {
        fullText += `Query Parameters:\n`;
        ep.queryParams.forEach((q) => {
          fullText += `  - ${q.name} (${q.type}): ${q.description}\n`;
        });
      }
      if (ep.requestBody) {
        fullText += `Request Body Example:\n\`\`\`json\n${JSON.stringify(ep.requestBody, null, 2)}\n\`\`\`\n`;
      }
      const isXml = typeof ep.responseExample === 'string' && ep.responseExample.trim().startsWith('<');
      const responseStr = typeof ep.responseExample === 'string' ? ep.responseExample : JSON.stringify(ep.responseExample, null, 2);
      fullText += `Response Example:\n\`\`\`${isXml ? 'xml' : 'json'}\n${responseStr}\n\`\`\`\n\n`;
    });
  });

  return new NextResponse(fullText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
