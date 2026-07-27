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
    responseExample: JSON.stringify({ data: [{ id: 1, name: "User 1", username: "user_1" }], pagination: { page: 1, limit: 10, total: 26, totalPages: 3 } }, null, 2)
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
    responseExample: JSON.stringify({ id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz" }, null, 2)
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
    bodyExample: JSON.stringify({ name: "Jane Doe", username: "janedoe", email: "jane.doe@example.com" }, null, 2),
    responseExample: JSON.stringify({ id: "local-a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Jane Doe", username: "janedoe", email: "jane.doe@example.com", _sandbox: "created" }, null, 2)
  },
  {
    resource: 'users',
    method: 'PUT',
    path: '/users/:id',
    summary: 'Replace an existing user record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ name: "Jane Doe", username: "janedoe", email: "jane.doe@example.com" }, null, 2),
    responseExample: JSON.stringify({ id: 1, name: "Jane Doe", username: "janedoe", email: "jane.doe@example.com", _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'users',
    method: 'PATCH',
    path: '/users/:id',
    summary: 'Partially update specific fields of a user record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'User ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ name: "Jane Doe (Updated)" }, null, 2),
    responseExample: JSON.stringify({ id: 1, name: "Jane Doe (Updated)", _sandbox: "updated" }, null, 2)
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
    responseExample: JSON.stringify({ data: [{ id: 1, user_id: 1, title: "Post Title 1" }], pagination: { page: 1, limit: 10, total: 100 } }, null, 2)
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
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "Sample Post Title", body: "Post body content..." }, null, 2)
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
    bodyExample: JSON.stringify({ user_id: 1, title: "My New Post Title", body: "Detailed content body for the new post." }, null, 2),
    responseExample: JSON.stringify({ id: "local-b2c3d4e5-f6a7-8901-bcde-f12345678901", user_id: 1, title: "My New Post Title", body: "Detailed content body for the new post.", _sandbox: "created" }, null, 2)
  },
  {
    resource: 'posts',
    method: 'PUT',
    path: '/posts/:id',
    summary: 'Replace an existing post record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ user_id: 1, title: "Updated Post Title", body: "Updated body content." }, null, 2),
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "Updated Post Title", body: "Updated body content.", _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'posts',
    method: 'PATCH',
    path: '/posts/:id',
    summary: 'Partially update specific fields of a post record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Post ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ title: "Updated Post Title" }, null, 2),
    responseExample: JSON.stringify({ id: 1, title: "Updated Post Title", _sandbox: "updated" }, null, 2)
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
    responseExample: JSON.stringify({ data: [{ id: 1, post_id: 1, name: "Comment Title 1" }], pagination: { page: 1, limit: 10, total: 500 } }, null, 2)
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
    responseExample: JSON.stringify({ id: 1, post_id: 1, name: "id labore ex et quam laborum", email: "Eliseo@gardner.biz", body: "laudantium enim quasi est quidem magnam voluptatem" }, null, 2)
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
    bodyExample: JSON.stringify({ post_id: 1, name: "Great post!", email: "reader@example.com", body: "Loved reading this article." }, null, 2),
    responseExample: JSON.stringify({ id: "local-c3d4e5f6-7890-abcd-ef12-345678901234", post_id: 1, name: "Great post!", email: "reader@example.com", body: "Loved reading this article.", _sandbox: "created" }, null, 2)
  },
  {
    resource: 'comments',
    method: 'PUT',
    path: '/comments/:id',
    summary: 'Replace an existing comment record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ post_id: 1, name: "Updated comment title", email: "reader@example.com", body: "Updated comment text." }, null, 2),
    responseExample: JSON.stringify({ id: 1, post_id: 1, name: "Updated comment title", email: "reader@example.com", body: "Updated comment text.", _sandbox: "updated" }, null, 2)
  },
  {
    resource: 'comments',
    method: 'PATCH',
    path: '/comments/:id',
    summary: 'Partially update specific fields of a comment record in the session overlay.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Comment ID to patch (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ body: "Partially updated comment text." }, null, 2),
    responseExample: JSON.stringify({ id: 1, body: "Partially updated comment text.", _sandbox: "updated" }, null, 2)
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
    responseExample: JSON.stringify({ data: [{ id: 1, user_id: 1, title: "delectus aut autem", completed: false }], pagination: { page: 1, limit: 10, total: 200 } }, null, 2)
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
    bodyExample: JSON.stringify({ user_id: 1, title: "Complete API testing", completed: false }, null, 2),
    responseExample: JSON.stringify({ id: "local-d4e5f6a7-8901-bcde-f123-456789012345", user_id: 1, title: "Complete API testing", completed: false, _sandbox: "created" }, null, 2)
  },
  {
    resource: 'todos',
    method: 'PUT',
    path: '/todos/:id',
    summary: 'Replace an existing todo record in the session overlay. Global records remain untouched for other visitors and preserve original list position.',
    params: [
      { name: 'id', in: 'path', type: 'string | integer', description: 'Todo ID to update (e.g. 1 or local-<uuid>).' }
    ],
    bodyExample: JSON.stringify({ user_id: 1, title: "Complete API testing", completed: true }, null, 2),
    responseExample: JSON.stringify({ id: 1, user_id: 1, title: "Complete API testing", completed: true, _sandbox: "updated" }, null, 2)
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
  }
];
