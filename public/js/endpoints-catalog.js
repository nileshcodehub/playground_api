window.ALL_ENDPOINTS_CATALOG = [
  // USERS
  {
    resource: 'users',
    method: 'GET',
    path: '/users',
    summary: 'Retrieve a paginated list of users. Results merge shared global user records with session sandbox overlays (newly created users appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 30).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          name: "Leanne Graham",
          username: "bret",
          email: "sincere@april.biz",
          phone: "+1-770-555-0123",
          website: "hildegard.org",
          address: { street: "Kulas Light", city: "Gwenborough", zipcode: "92998-3874" },
          company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" }
        }
      ],
      pagination: { page: 1, limit: 10, total: 25, totalPages: 3, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'GET',
    path: '/users/:id',
    summary: 'Retrieve a single user by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID (e.g. 1 for global user or local-<uuid> for sandbox user).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      username: "bret",
      email: "sincere@april.biz",
      phone: "+1-770-555-0123",
      website: "hildegard.org",
      address: { street: "Kulas Light", city: "Gwenborough", zipcode: "92998-3874" },
      company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" }
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'POST',
    path: '/users',
    summary: 'Create a new session sandbox user record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'name', in: 'body', type: 'string', description: 'Full name of the user.' },
      { name: 'username', in: 'body', type: 'string', description: 'Username.' },
      { name: 'email', in: 'body', type: 'string', description: 'Email address.' }
    ],
    bodyExample: JSON.stringify({
      name: "Alexander Wright",
      username: "alex_w",
      email: "alexander.wright@techflow.io",
      phone: "+1-415-555-0182",
      website: "alexwright.dev",
      address: { street: "Market St", city: "San Francisco", zipcode: "94103" },
      company: { name: "TechFlow Labs", catchPhrase: "Distributed cloud infrastructure" }
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Alexander Wright",
      username: "alex_w",
      email: "alexander.wright@techflow.io",
      phone: "+1-415-555-0182",
      website: "alexwright.dev",
      address: { street: "Market St", city: "San Francisco", zipcode: "94103" },
      company: { name: "TechFlow Labs", catchPhrase: "Distributed cloud infrastructure" },
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'PUT',
    path: '/users/:id',
    summary: 'Replace an existing user record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({
      name: "Leanne Graham (Updated)",
      username: "bret",
      email: "sincere@april.biz",
      website: "hildegard-updated.org"
    }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham (Updated)",
      username: "bret",
      email: "sincere@april.biz",
      website: "hildegard-updated.org",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'PATCH',
    path: '/users/:id',
    summary: 'Partially update specific fields of a user record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ website: "https://updated-portfolio.dev" }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      website: "https://updated-portfolio.dev",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'users',
    method: 'DELETE',
    path: '/users/:id',
    summary: 'Remove a user record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },

  // POSTS
  {
    resource: 'posts',
    method: 'GET',
    path: '/posts',
    summary: 'Retrieve a paginated list of posts. Results merge shared global post records with session sandbox overlays (newly created posts appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 30).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          user_id: 1,
          title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
          body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
        }
      ],
      pagination: { page: 1, limit: 10, total: 100, totalPages: 10, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'GET',
    path: '/posts/:id',
    summary: 'Retrieve a single post by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'POST',
    path: '/posts',
    summary: 'Create a new session sandbox post record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'user_id', in: 'body', type: 'integer', description: 'Author user ID.' },
      { name: 'title', in: 'body', type: 'string', description: 'Post title.' },
      { name: 'body', in: 'body', type: 'string', description: 'Post body content.' }
    ],
    bodyExample: JSON.stringify({
      user_id: 1,
      title: "optimizing database indexing strategies for large scale applications",
      body: "database indexing is one of the most critical factors in query performance. by creating proper B-tree and GIN indexes, read latency can drop from seconds to milliseconds during peak concurrency loads."
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      user_id: 1,
      title: "optimizing database indexing strategies for large scale applications",
      body: "database indexing is one of the most critical factors in query performance. by creating proper B-tree and GIN indexes, read latency can drop from seconds to milliseconds during peak concurrency loads.",
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'PUT',
    path: '/posts/:id',
    summary: 'Replace an existing post record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati (Updated)",
      body: "quia et suscipit suscipit recusandae consequuntur expedita..."
    }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati (Updated)",
      body: "quia et suscipit suscipit recusandae consequuntur expedita...",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'PATCH',
    path: '/posts/:id',
    summary: 'Partially update specific fields of a post record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ title: "sunt aut facere (Patched)" }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      title: "sunt aut facere (Patched)",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'posts',
    method: 'DELETE',
    path: '/posts/:id',
    summary: 'Remove a post record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },

  // COMMENTS
  {
    resource: 'comments',
    method: 'GET',
    path: '/comments',
    summary: 'Retrieve a paginated list of comments. Results merge shared global comment records with session sandbox overlays (newly created comments appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 30).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        {
          id: 1,
          post_id: 1,
          name: "id labore ex et quam laborum",
          email: "Eliseo@gardner.biz",
          body: "laudantium enim quasi est quidem magnam voluptatem aut eveniet quas aliquid sint expedita consequuntur alias ea quam expedita possimus"
        }
      ],
      pagination: { page: 1, limit: 10, total: 300, totalPages: 30, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'GET',
    path: '/comments/:id',
    summary: 'Retrieve a single comment by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      post_id: 1,
      name: "id labore ex et quam laborum",
      email: "Eliseo@gardner.biz",
      body: "laudantium enim quasi est quidem magnam voluptatem aut eveniet quas aliquid sint expedita consequuntur alias ea quam expedita possimus"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'POST',
    path: '/comments',
    summary: 'Create a new session sandbox comment record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'post_id', in: 'body', type: 'integer', description: 'Associated post ID.' },
      { name: 'name', in: 'body', type: 'string', description: 'Comment title/name.' },
      { name: 'email', in: 'body', type: 'string', description: 'Author email address.' },
      { name: 'body', in: 'body', type: 'string', description: 'Comment text content.' }
    ],
    bodyExample: JSON.stringify({
      post_id: 1,
      name: "super helpful post on JWT security",
      email: "dev_reviewer@tech.net",
      body: "This article helped our team fix an identity cookie validation issue in production. Thanks for sharing these clear code snippets!"
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-c3d4e5f6-7890-abcd-ef12-345678901234",
      post_id: 1,
      name: "super helpful post on JWT security",
      email: "dev_reviewer@tech.net",
      body: "This article helped our team fix an identity cookie validation issue in production. Thanks for sharing these clear code snippets!",
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'PUT',
    path: '/comments/:id',
    summary: 'Replace an existing comment record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({
      post_id: 1,
      name: "id labore ex et quam laborum (Updated)",
      email: "Eliseo@gardner.biz",
      body: "Updated comment text body content."
    }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      post_id: 1,
      name: "id labore ex et quam laborum (Updated)",
      email: "Eliseo@gardner.biz",
      body: "Updated comment text body content.",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'PATCH',
    path: '/comments/:id',
    summary: 'Partially update specific fields of a comment record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ body: "Partially updated comment text body content." }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      body: "Partially updated comment text body content.",
      _sandbox: "updated"
    }, null, 2)
  },
  {
    resource: 'comments',
    method: 'DELETE',
    path: '/comments/:id',
    summary: 'Remove a comment record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },

  // TODOS
  {
    resource: 'todos',
    method: 'GET',
    path: '/todos',
    summary: 'Retrieve a paginated list of todos. Results merge shared global todo records with session sandbox overlays (newly created todos appear at the top).',
    params: [
      { name: 'page', in: 'query', type: 'integer', description: 'Page number (1-indexed, default 1).' },
      { name: 'limit', in: 'query', type: 'integer', description: 'Number of records per page (default 10, max 30).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      data: [
        { id: 1, user_id: 1, title: "delectus aut autem", completed: false }
      ],
      pagination: { page: 1, limit: 10, total: 125, totalPages: 13, hasNextPage: true, hasPrevPage: false }
    }, null, 2)
  },
  {
    resource: 'todos',
    method: 'GET',
    path: '/todos/:id',
    summary: 'Retrieve a single todo item by ID. Supports plain integer IDs for global records and string IDs formatted as local-<uuid> for session sandbox records.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "delectus aut autem", completed: false }, null, 2)
  },
  {
    resource: 'todos',
    method: 'POST',
    path: '/todos',
    summary: 'Create a new session sandbox todo record. Returns a local-<uuid> formatted ID with _sandbox: "created". Each session identity is capped at 30 created records.',
    params: [
      { name: 'user_id', in: 'body', type: 'integer', description: 'Owner user ID.' },
      { name: 'title', in: 'body', type: 'string', description: 'Todo item title.' },
      { name: 'completed', in: 'body', type: 'boolean', description: 'Completion status (true/false).' }
    ],
    bodyExample: JSON.stringify({
      user_id: 1,
      title: "Review and merge pull request #142 for identity middleware",
      completed: true
    }, null, 2),
    responseExample: JSON.stringify({
      id: "local-d4e5f6a7-8901-bcde-f123-456789012345",
      user_id: 1,
      title: "Review and merge pull request #142 for identity middleware",
      completed: true,
      _sandbox: "created"
    }, null, 2)
  },
  {
    resource: 'todos',
    method: 'PUT',
    path: '/todos/:id',
    summary: 'Replace an existing todo record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ user_id: 1, title: "delectus aut autem", completed: true }, null, 2),
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "delectus aut autem", completed: true, _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'todos',
    method: 'PATCH',
    path: '/todos/:id',
    summary: 'Partially update specific fields of a todo record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ completed: true }, null, 2),
    responseExample: JSON.stringify({ id: 1, completed: true, _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'todos',
    method: 'DELETE',
    path: '/todos/:id',
    summary: 'Remove a todo record from the requesting session view. The underlying global record is unaffected for other visitors.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to delete (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: null,
    responseExample: "204 No Content"
  },
  // AUTH
  {
    resource: 'auth',
    method: 'POST',
    path: '/auth/login',
    summary: 'Authenticate user with username/email & password to receive signed JWT access and refresh tokens.',
    params: [
      { name: 'username', in: 'body', type: 'string', description: 'Username (e.g. Bret or custom registered username).' },
      { name: 'password', in: 'body', type: 'string', description: 'Password string.' }
    ],
    bodyExample: JSON.stringify({ username: "Bret", password: "password123" }, null, 2),
    responseExample: JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      token_type: "Bearer",
      expires_in: 900,
      user: {
        id: 1,
        name: "Leanne Graham",
        username: "bret",
        email: "sincere@april.biz"
      }
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'POST',
    path: '/auth/register',
    summary: 'Register a new session user and immediately receive signed JWT access and refresh tokens.',
    params: [
      { name: 'name', in: 'body', type: 'string', description: 'Full name of the user.' },
      { name: 'username', in: 'body', type: 'string', description: 'Unique username.' },
      { name: 'email', in: 'body', type: 'string', description: 'User email address.' }
    ],
    bodyExample: JSON.stringify({ name: "Alice Smith", username: "alice", email: "alice@example.com", password: "password123" }, null, 2),
    responseExample: JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      token_type: "Bearer",
      expires_in: 900,
      user: {
        id: "local-d4e5f6a7-8901-bcde-f123-456789012345",
        name: "Alice Smith",
        username: "alice",
        email: "alice@example.com",
        _sandbox: "created"
      }
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'POST',
    path: '/auth/refresh',
    summary: 'Exchange a valid refresh token for a fresh 15-minute JWT access token.',
    params: [
      { name: 'refreshToken', in: 'body', type: 'string', description: 'Valid refresh token string.' }
    ],
    bodyExample: JSON.stringify({ refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }, null, 2),
    responseExample: JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      token_type: "Bearer",
      expires_in: 900
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'GET',
    path: '/auth/me',
    summary: 'Retrieve current authenticated user profile using Authorization: Bearer <access_token>.',
    params: [
      { name: 'Authorization', in: 'header', type: 'string', description: 'Bearer <access_token>' }
    ],
    bodyExample: null,
    responseExample: JSON.stringify({
      id: 1,
      name: "Leanne Graham",
      username: "bret",
      email: "sincere@april.biz"
    }, null, 2)
  },
  {
    resource: 'auth',
    method: 'PATCH',
    path: '/auth/me',
    summary: 'Update current authenticated user profile in the session sandbox using Authorization: Bearer <access_token>.',
    params: [
      { name: 'Authorization', in: 'header', type: 'string', description: 'Bearer <access_token>' }
    ],
    bodyExample: JSON.stringify({ name: "Bret - Updated Profile" }, null, 2),
    responseExample: JSON.stringify({
      id: 1,
      name: "Bret - Updated Profile",
      username: "bret",
      email: "sincere@april.biz",
      _sandbox: "updated"
    }, null, 2)
  },
  // MEDIA (AVATARS & THUMBNAILS)
  {
    resource: 'media',
    method: 'GET',
    path: '/public/avatars/:seed.svg',
    summary: 'Generate deterministic vector SVG avatar for a user seed string or ID with custom size and squircle/circle background.',
    params: [
      { name: 'seed', in: 'path', type: 'string', description: 'Seed string (e.g. bret, alice, user-1) for gradient hashing and initials extraction.' },
      { name: 'size', in: 'query', type: 'integer', description: 'Avatar dimension in pixels (default 128).' },
      { name: 'rounded', in: 'query', type: 'boolean', description: 'Circular vs squircle rendering (default true).' }
    ],
    bodyExample: null,
    responseExample: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="64" fill="#059669" />
  <text x="50%" y="54%" font-family="Inter, sans-serif" font-size="54" font-weight="700" fill="#ffffff" text-anchor="middle">BR</text>
</svg>`
  },
  {
    resource: 'media',
    method: 'GET',
    path: '/public/thumbnails/:seed.svg',
    summary: 'Generate 600x400 landscape vector SVG placeholder image with mesh gradient background, custom text, and dimension badge.',
    params: [
      { name: 'seed', in: 'path', type: 'string', description: 'Seed string (e.g. post-1, react-tutorial) for background color hashing.' },
      { name: 'width', in: 'query', type: 'integer', description: 'Thumbnail width in pixels (default 600).' },
      { name: 'height', in: 'query', type: 'integer', description: 'Thumbnail height in pixels (default 400).' },
      { name: 'text', in: 'query', type: 'string', description: 'Custom label text override.' }
    ],
    bodyExample: null,
    responseExample: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" fill="#4f46e5" />
  <text x="50%" y="46%" font-family="Inter, sans-serif" font-size="33" font-weight="700" fill="#ffffff" text-anchor="middle">Post #1</text>
</svg>`
  }
];
