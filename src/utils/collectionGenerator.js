import { getEndpointsForResource } from '../config/endpointsCatalog.js';

const RESOURCES = ['users', 'posts', 'comments', 'todos', 'auth'];

/**
 * Helper to collect catalog endpoints across all or specific resources
 */
const getAllEndpoints = (targetResource = null) => {
  const all = [];
  const resourcesToExport = (targetResource && targetResource !== 'all' && RESOURCES.includes(targetResource.toLowerCase()))
    ? [targetResource.toLowerCase()]
    : RESOURCES;

  resourcesToExport.forEach((resource) => {
    const endpoints = getEndpointsForResource(resource);
    endpoints.forEach((ep) => {
      all.push({ ...ep, resource });
    });
  });
  return all;
};

const getTitleSuffix = (targetResource = null) => {
  if (targetResource && targetResource !== 'all' && RESOURCES.includes(targetResource.toLowerCase())) {
    const capitalized = targetResource.charAt(0).toUpperCase() + targetResource.slice(1).toLowerCase();
    return ` — ${capitalized}`;
  }
  return '';
};

/**
 * 1. OpenAPI 3.0.3 Specification Generator
 */
export const generateOpenApiSpec = (hostUrl = 'http://localhost:3000', targetResource = null) => {
  const paths = {};
  const endpoints = getAllEndpoints(targetResource);

  endpoints.forEach((ep) => {
    const openApiPath = ep.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    if (!paths[openApiPath]) {
      paths[openApiPath] = {};
    }

    const method = ep.method.toLowerCase();
    const parameters = [];

    if (ep.params) {
      ep.params.forEach((p) => {
        parameters.push({
          name: p.name,
          in: p.in,
          required: p.in === 'path',
          description: p.description,
          schema: { type: p.type.includes('integer') ? 'integer' : 'string' }
        });
      });
    }

    paths[openApiPath][method] = {
      summary: ep.summary,
      parameters,
      responses: {
        200: {
          description: 'Successful Operation',
          content: {
            'application/json': {
              example: ep.responseExample ? (tryParse(ep.responseExample)) : {}
            }
          }
        }
      }
    };

    if (['post', 'put', 'patch'].includes(method) && ep.bodyExample) {
      paths[openApiPath][method].requestBody = {
        required: true,
        content: {
          'application/json': {
            example: tryParse(ep.bodyExample)
          }
        }
      };
    }
  });

  return {
    openapi: '3.0.3',
    info: {
      title: `Playground API${getTitleSuffix(targetResource)}`,
      version: '1.0.0',
      description: 'Zero-config per-identity sandboxed mock REST API with relational filtering, dynamic sorting, and network simulation.'
    },
    servers: [{ url: hostUrl, description: 'Default Server' }],
    paths
  };
};

/**
 * 2. Postman Collection v2.1.0 Generator
 */
export const generatePostmanCollection = (hostUrl = 'http://localhost:3000', targetResource = null) => {
  const itemsByResource = {};
  const endpoints = getAllEndpoints(targetResource);

  endpoints.forEach((ep) => {
    const resName = ep.resource.toUpperCase();
    if (!itemsByResource[resName]) {
      itemsByResource[resName] = [];
    }

    const pathSegments = ep.path.split('/').filter(Boolean).map(seg => {
      return seg.startsWith(':') ? `:${seg.slice(1)}` : seg;
    });

    const item = {
      name: `${ep.method} ${ep.path}`,
      request: {
        method: ep.method,
        header: [{ key: 'Content-Type', value: 'application/json' }],
        url: {
          raw: `{{baseUrl}}${ep.path}`,
          host: ['{{baseUrl}}'],
          path: pathSegments
        },
        description: ep.summary
      }
    };

    if (ep.bodyExample && ['POST', 'PUT', 'PATCH'].includes(ep.method)) {
      item.request.body = {
        mode: 'raw',
        raw: ep.bodyExample,
        options: { raw: { language: 'json' } }
      };
    }

    itemsByResource[resName].push(item);
  });

  const folderItems = Object.entries(itemsByResource).map(([folderName, items]) => ({
    name: folderName,
    item: items
  }));

  return {
    info: {
      name: `Playground API Collection${getTitleSuffix(targetResource)}`,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    variable: [
      { key: 'baseUrl', value: hostUrl }
    ],
    item: folderItems
  };
};

/**
 * 3. Bruno API Client Collection Generator
 */
export const generateBrunoCollection = (hostUrl = 'http://localhost:3000', targetResource = null) => {
  const endpoints = getAllEndpoints(targetResource);
  const items = endpoints.map((ep) => {
    return {
      name: `${ep.method} ${ep.path}`,
      type: 'http',
      request: {
        method: ep.method,
        url: `{{baseUrl}}${ep.path}`,
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        body: ep.bodyExample ? { mode: 'json', json: ep.bodyExample } : null
      }
    };
  });

  return {
    name: `Playground API (Bruno)${getTitleSuffix(targetResource)}`,
    version: '1',
    variables: [{ name: 'baseUrl', value: hostUrl }],
    items
  };
};

/**
 * 4. Insomnia v4 Collection Generator
 */
export const generateInsomniaCollection = (hostUrl = 'http://localhost:3000', targetResource = null) => {
  const endpoints = getAllEndpoints(targetResource);
  const resources = [
    {
      _id: 'wrk_playground_api',
      _type: 'workspace',
      name: `Playground API${getTitleSuffix(targetResource)}`
    },
    {
      _id: 'env_playground_api',
      _type: 'environment',
      parentId: 'wrk_playground_api',
      name: 'Base Environment',
      data: { baseUrl: hostUrl }
    }
  ];

  endpoints.forEach((ep, idx) => {
    resources.push({
      _id: `req_${idx + 1}`,
      _type: 'request',
      parentId: 'wrk_playground_api',
      name: `${ep.method} ${ep.path}`,
      method: ep.method,
      url: `{{ _.baseUrl }}${ep.path}`,
      headers: [{ name: 'Content-Type', value: 'application/json' }],
      body: ep.bodyExample ? { mimeType: 'application/json', text: ep.bodyExample } : {}
    });
  });

  return {
    _type: 'export',
    __export_format: 4,
    resources
  };
};

const tryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};
