import express from 'express';
import { printSchema } from 'graphql';
import { schema } from '../graphql/schema.js';
import {
  generateOpenApiSpec,
  generatePostmanCollection,
  generateBrunoCollection,
  generateInsomniaCollection
} from '../utils/collectionGenerator.js';

const router = express.Router();

const getHostUrl = (req) => {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
};

const getFilename = (prefix, suffix, resource) => {
  const cleanRes = (resource && resource !== 'all') ? resource.toLowerCase() : null;
  return cleanRes ? `${prefix}-${cleanRes}.${suffix}` : `${prefix}.${suffix}`;
};

// 1. OpenAPI 3.0 Specification Download
router.get('/openapi.json', (req, res) => {
  const resource = req.query.resource;
  const spec = generateOpenApiSpec(getHostUrl(req), resource);
  const filename = getFilename('playground-api', 'openapi.json', resource);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(JSON.stringify(spec, null, 2));
});

// 2. Postman Collection v2.1 Download
router.get('/postman.json', (req, res) => {
  const resource = req.query.resource;
  const collection = generatePostmanCollection(getHostUrl(req), resource);
  const filename = getFilename('playground-api', 'postman_collection.json', resource);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(JSON.stringify(collection, null, 2));
});

// 3. Bruno Collection Download
router.get('/bruno.json', (req, res) => {
  const resource = req.query.resource;
  const collection = generateBrunoCollection(getHostUrl(req), resource);
  const filename = getFilename('playground-api', 'bruno_collection.json', resource);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(JSON.stringify(collection, null, 2));
});

// 4. Insomnia Collection v4 Download
router.get('/insomnia.json', (req, res) => {
  const resource = req.query.resource;
  const collection = generateInsomniaCollection(getHostUrl(req), resource);
  const filename = getFilename('playground-api', 'insomnia_collection.json', resource);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(JSON.stringify(collection, null, 2));
});

// 5. GraphQL SDL Schema Download
router.get('/schema.graphql', (req, res) => {
  const sdl = printSchema(schema);
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="playground-api.graphql"');
  res.send(sdl);
});

// 6. Full TypeScript Definitions Download (.d.ts)
router.get('/playground-api.d.ts', (req, res) => {
  res.download('public/types/playground-api.d.ts', 'playground-api.d.ts');
});

export default router;
