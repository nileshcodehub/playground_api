import { Router } from 'express';
import { graphql } from 'graphql';
import { schema } from '../graphql/schema.js';

const router = Router();

const GRAPHIQL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Playground API — GraphiQL Interactive IDE</title>
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg" />
  <link rel="stylesheet" href="https://unpkg.com/graphiql@3.0.0/graphiql.min.css" />
  <style>
    body { height: 100vh; margin: 0; overflow: hidden; background: #0f172a; }
    #graphiql { height: 100vh; }
  </style>
</head>
<body>
  <div id="graphiql"></div>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/graphiql@3.0.0/graphiql.min.js"></script>
  <script>
    const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
    ReactDOM.render(
      React.createElement(GraphiQL, {
        fetcher,
        defaultQuery: \`# Welcome to Playground API GraphQL Sandbox Gateway!
# State mutations are isolated to your session identity.

query GetUsersWithPosts {
  users(limit: 5) {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
\`
      }),
      document.getElementById('graphiql')
    );
  </script>
</body>
</html>`;

// Serve GraphiQL IDE on GET /graphql
router.get('/', (req, res) => {
  const acceptHeader = req.get('Accept') || '';
  if (acceptHeader.includes('text/html') || !req.query.query) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(GRAPHIQL_HTML);
  }

  // If GET query parameter is provided (e.g. GET /graphql?query={users{id}})
  return handleGraphQLRequest(req, res, req.query);
});

// Handle GraphQL POST requests
router.post('/', async (req, res) => {
  return handleGraphQLRequest(req, res, req.body);
});

async function handleGraphQLRequest(req, res, body) {
  const { query, variables, operationName } = body || {};

  if (!query) {
    return res.status(400).json({
      errors: [{ message: 'Must provide query string.' }]
    });
  }

  try {
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      contextValue: {
        identityId: req.identityId
      }
    });

    const statusCode = result.errors ? 400 : 200;
    return res.status(statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      errors: [{ message: error.message || 'Internal GraphQL server error.' }]
    });
  }
}

export default router;
