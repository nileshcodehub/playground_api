export const getEndpointsForResource = (resource, sampleRecord = null) => {
  if (resource === 'users') {
    const fallbackUser = {
      id: 1,
      name: "Leanne Graham",
      username: "bret",
      email: "sincere@april.biz",
      phone: "+1-770-555-0123",
      website: "hildegard.org",
      address: { street: "Kulas Light", city: "Gwenborough", zipcode: "92998-3874" },
      company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" }
    };
    const realUser = sampleRecord || fallbackUser;

    return [
      {
        method: "GET",
        path: "/users",
        summary: "Retrieve a paginated list of users. Results merge shared global user records with session sandbox overlays (newly created users appear at the top).",
        params: [
          { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
          { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." }
        ],
        bodyExample: null,
        responseExample: JSON.stringify({
          data: [
            {
              id: "local-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              name: realUser.name || "Jane Doe",
              username: realUser.username || "janedoe",
              email: realUser.email || "jane.doe@example.com",
              _sandbox: "created"
            },
            realUser
          ],
          pagination: { page: 1, limit: 10, total: 26, totalPages: 3, hasNextPage: true, hasPrevPage: false }
        }, null, 2)
      },
      {
        method: "GET",
        path: "/users/:id",
        summary: `Retrieve a single user by ID. Supports plain integer IDs for global records (e.g. ${realUser.id}) and string IDs formatted as local-<uuid> for session sandbox records.`,
        params: [
          { name: "id", in: "path", type: "string | integer", description: `User ID (e.g. ${realUser.id} for global user or local-<uuid> for sandbox user).` }
        ],
        bodyExample: null,
        responseExample: JSON.stringify(realUser, null, 2)
      },
      {
        method: "POST",
        path: "/users",
        summary: "Create a new session sandbox user record. Returns a local-<uuid> formatted ID with _sandbox: 'created'. Each session identity is capped at 30 created records.",
        params: [
          { name: "name", in: "body", type: "string", description: "Full name of the user." },
          { name: "username", in: "body", type: "string", description: "Username." },
          { name: "email", in: "body", type: "string", description: "Email address." },
          { name: "phone", in: "body", type: "string", description: "Phone number." },
          { name: "website", in: "body", type: "string", description: "Website URL." },
          { name: "address", in: "body", type: "object", description: "JSON object containing street, city, zipcode." },
          { name: "company", in: "body", type: "object", description: "JSON object containing company name and catchPhrase." }
        ],
        bodyExample: JSON.stringify({
          name: realUser.name || "Jane Doe",
          username: realUser.username || "janedoe",
          email: realUser.email || "jane.doe@example.com",
          phone: realUser.phone || "+1-555-01999",
          website: realUser.website || "https://janedoe.dev",
          address: realUser.address || { street: "42 Wallaby Way", city: "Sydney", zipcode: "20000" },
          company: realUser.company || { name: "Acme Corp", catchPhrase: "Building the future" }
        }, null, 2),
        responseExample: JSON.stringify({
          id: "local-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          name: realUser.name || "Jane Doe",
          username: realUser.username || "janedoe",
          email: realUser.email || "jane.doe@example.com",
          _sandbox: "created"
        }, null, 2)
      },
      {
        method: "PUT",
        path: "/users/:id",
        summary: "Replace an existing user record in the session overlay. Global records remain untouched for other visitors and preserve original list position.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `User ID to update (e.g. ${realUser.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({
          name: `${realUser.name} (Updated)`,
          username: realUser.username,
          email: realUser.email,
          website: "https://updated-user.dev"
        }, null, 2),
        responseExample: JSON.stringify({
          ...realUser,
          name: `${realUser.name} (Updated)`,
          website: "https://updated-user.dev",
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "PATCH",
        path: "/users/:id",
        summary: "Partially update specific fields of a user record in the session overlay.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `User ID to patch (e.g. ${realUser.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({
          name: `${realUser.name} (Updated)`,
          website: "https://updated-user.dev"
        }, null, 2),
        responseExample: JSON.stringify({
          ...realUser,
          name: `${realUser.name} (Updated)`,
          website: "https://updated-user.dev",
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "DELETE",
        path: "/users/:id",
        summary: "Remove a user record from the requesting session view. The underlying global record is unaffected for other visitors.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `User ID to delete (e.g. ${realUser.id} or local-<uuid>).` }
        ],
        bodyExample: null,
        responseExample: "204 No Content"
      }
    ];
  }

  if (resource === 'posts') {
    const fallbackPost = {
      id: 1,
      user_id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
    };
    const realPost = sampleRecord || fallbackPost;

    return [
      {
        method: "GET",
        path: "/posts",
        summary: "Retrieve a paginated list of posts. Results merge shared global posts with session sandbox overlays (newly created posts appear at the top).",
        params: [
          { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
          { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." }
        ],
        bodyExample: null,
        responseExample: JSON.stringify({
          data: [
            {
              id: "local-b2c3d4e5-f6a7-8901-bcde-f12345678901",
              user_id: realPost.user_id || 1,
              title: realPost.title || "My New Post Title",
              _sandbox: "created"
            },
            realPost
          ],
          pagination: { page: 1, limit: 10, total: 101, totalPages: 11, hasNextPage: true, hasPrevPage: false }
        }, null, 2)
      },
      {
        method: "GET",
        path: "/posts/:id",
        summary: `Retrieve a single post by ID. Supports plain integer IDs for global records (e.g. ${realPost.id}) and string IDs formatted as local-<uuid> for session sandbox records.`,
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Post ID (e.g. ${realPost.id} for global post or local-<uuid> for sandbox post).` }
        ],
        bodyExample: null,
        responseExample: JSON.stringify(realPost, null, 2)
      },
      {
        method: "POST",
        path: "/posts",
        summary: "Create a new session sandbox post record. Returns a local-<uuid> formatted ID with _sandbox: 'created'. Each session identity is capped at 30 created records.",
        params: [
          { name: "user_id", in: "body", type: "integer", description: "Author user ID." },
          { name: "title", in: "body", type: "string", description: "Post title." },
          { name: "body", in: "body", type: "string", description: "Post body text content." }
        ],
        bodyExample: JSON.stringify({
          user_id: realPost.user_id || 1,
          title: realPost.title || "My New Post Title",
          body: realPost.body || "Detailed content body for the new post created in sandbox."
        }, null, 2),
        responseExample: JSON.stringify({
          id: "local-b2c3d4e5-f6a7-8901-bcde-f12345678901",
          user_id: realPost.user_id || 1,
          title: realPost.title || "My New Post Title",
          body: realPost.body || "Detailed content body for the new post created in sandbox.",
          _sandbox: "created"
        }, null, 2)
      },
      {
        method: "PUT",
        path: "/posts/:id",
        summary: "Replace an existing post record in the session overlay. Global records remain untouched for other visitors and preserve original list position.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Post ID to update (e.g. ${realPost.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({
          user_id: realPost.user_id || 1,
          title: `${realPost.title} (Updated)`,
          body: realPost.body || "Updated body content."
        }, null, 2),
        responseExample: JSON.stringify({
          ...realPost,
          title: `${realPost.title} (Updated)`,
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "PATCH",
        path: "/posts/:id",
        summary: "Partially update specific fields of a post record in the session overlay.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Post ID to patch (e.g. ${realPost.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({ title: `${realPost.title} (Updated)` }, null, 2),
        responseExample: JSON.stringify({
          ...realPost,
          title: `${realPost.title} (Updated)`,
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "DELETE",
        path: "/posts/:id",
        summary: "Remove a post record from the requesting session view. The underlying global record is unaffected for other visitors.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Post ID to delete (e.g. ${realPost.id} or local-<uuid>).` }
        ],
        bodyExample: null,
        responseExample: "204 No Content"
      }
    ];
  }

  if (resource === 'comments') {
    const fallbackComment = {
      id: 1,
      post_id: 1,
      name: "id labore ex et quam laborum",
      email: "Eliseo@gardner.biz",
      body: "laudantium enim quasi est quidem magnam voluptatem aut eveniet quas aliquid sint expedita consequuntur alias ea quam expedita possimus"
    };
    const realComment = sampleRecord || fallbackComment;

    return [
      {
        method: "GET",
        path: "/comments",
        summary: "Retrieve a paginated list of comments. Results merge shared global comments with session sandbox overlays (newly created comments appear at the top).",
        params: [
          { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
          { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." }
        ],
        bodyExample: null,
        responseExample: JSON.stringify({
          data: [
            {
              id: "local-c3d4e5f6-7890-abcd-ef12-345678901234",
              post_id: realComment.post_id || 1,
              name: realComment.name || "Great Insights",
              _sandbox: "created"
            },
            realComment
          ],
          pagination: { page: 1, limit: 10, total: 301, totalPages: 31, hasNextPage: true, hasPrevPage: false }
        }, null, 2)
      },
      {
        method: "GET",
        path: "/comments/:id",
        summary: `Retrieve a single comment by ID. Supports plain integer IDs for global records (e.g. ${realComment.id}) and string IDs formatted as local-<uuid> for session sandbox records.`,
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Comment ID (e.g. ${realComment.id} for global comment or local-<uuid> for sandbox comment).` }
        ],
        bodyExample: null,
        responseExample: JSON.stringify(realComment, null, 2)
      },
      {
        method: "POST",
        path: "/comments",
        summary: "Create a new session sandbox comment record. Returns a local-<uuid> formatted ID with _sandbox: 'created'. Each session identity is capped at 30 created records.",
        params: [
          { name: "post_id", in: "body", type: "integer", description: "Target post ID." },
          { name: "name", in: "body", type: "string", description: "Comment title or reviewer name." },
          { name: "email", in: "body", type: "string", description: "Commenter email address." },
          { name: "body", in: "body", type: "string", description: "Comment text content." }
        ],
        bodyExample: JSON.stringify({
          post_id: realComment.post_id || 1,
          name: realComment.name || "Great Insights",
          email: realComment.email || "reviewer@example.com",
          body: realComment.body || "Thanks for sharing these detailed benchmarks and examples."
        }, null, 2),
        responseExample: JSON.stringify({
          id: "local-c3d4e5f6-7890-abcd-ef12-345678901234",
          post_id: realComment.post_id || 1,
          name: realComment.name || "Great Insights",
          email: realComment.email || "reviewer@example.com",
          body: realComment.body || "Thanks for sharing these detailed benchmarks and examples.",
          _sandbox: "created"
        }, null, 2)
      },
      {
        method: "PUT",
        path: "/comments/:id",
        summary: "Replace an existing comment record in the session overlay. Global records remain untouched for other visitors and preserve original list position.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Comment ID to update (e.g. ${realComment.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({
          post_id: realComment.post_id || 1,
          name: `${realComment.name} (Updated)`,
          email: realComment.email,
          body: realComment.body
        }, null, 2),
        responseExample: JSON.stringify({
          ...realComment,
          name: `${realComment.name} (Updated)`,
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "PATCH",
        path: "/comments/:id",
        summary: "Partially update specific fields of a comment record in the session overlay.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Comment ID to patch (e.g. ${realComment.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({ name: `${realComment.name} (Updated)` }, null, 2),
        responseExample: JSON.stringify({
          ...realComment,
          name: `${realComment.name} (Updated)`,
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "DELETE",
        path: "/comments/:id",
        summary: "Remove a comment record from the requesting session view. The underlying global record is unaffected for other visitors.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Comment ID to delete (e.g. ${realComment.id} or local-<uuid>).` }
        ],
        bodyExample: null,
        responseExample: "204 No Content"
      }
    ];
  }

  if (resource === 'todos') {
    const fallbackTodo = {
      id: 1,
      user_id: 1,
      title: "delectus aut autem",
      completed: false
    };
    const realTodo = sampleRecord || fallbackTodo;

    return [
      {
        method: "GET",
        path: "/todos",
        summary: "Retrieve a paginated list of todos. Results merge shared global todos with session sandbox overlays (newly created todos appear at the top).",
        params: [
          { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
          { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." }
        ],
        bodyExample: null,
        responseExample: JSON.stringify({
          data: [
            {
              id: "local-d4e5f6a7-8901-bcde-f123-456789012345",
              user_id: realTodo.user_id || 1,
              title: realTodo.title || "Buy groceries",
              completed: true,
              _sandbox: "created"
            },
            realTodo
          ],
          pagination: { page: 1, limit: 10, total: 126, totalPages: 13, hasNextPage: true, hasPrevPage: false }
        }, null, 2)
      },
      {
        method: "GET",
        path: "/todos/:id",
        summary: `Retrieve a single todo item by ID. Supports plain integer IDs for global records (e.g. ${realTodo.id}) and string IDs formatted as local-<uuid> for session sandbox records.`,
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Todo ID (e.g. ${realTodo.id} for global todo or local-<uuid> for sandbox todo).` }
        ],
        bodyExample: null,
        responseExample: JSON.stringify(realTodo, null, 2)
      },
      {
        method: "POST",
        path: "/todos",
        summary: "Create a new session sandbox todo record. Returns a local-<uuid> formatted ID with _sandbox: 'created'. Each session identity is capped at 30 created records.",
        params: [
          { name: "user_id", in: "body", type: "integer", description: "Owner user ID." },
          { name: "title", in: "body", type: "string", description: "Todo task title." },
          { name: "completed", in: "body", type: "boolean", description: "Completion status (true / false)." }
        ],
        bodyExample: JSON.stringify({
          user_id: realTodo.user_id || 1,
          title: realTodo.title || "Buy groceries",
          completed: realTodo.completed ?? false
        }, null, 2),
        responseExample: JSON.stringify({
          id: "local-d4e5f6a7-8901-bcde-f123-456789012345",
          user_id: realTodo.user_id || 1,
          title: realTodo.title || "Buy groceries",
          completed: realTodo.completed ?? false,
          _sandbox: "created"
        }, null, 2)
      },
      {
        method: "PUT",
        path: "/todos/:id",
        summary: "Replace an existing todo record in the session overlay. Global records remain untouched for other visitors and preserve original list position.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Todo ID to update (e.g. ${realTodo.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({
          user_id: realTodo.user_id || 1,
          title: `${realTodo.title} (Updated)`,
          completed: true
        }, null, 2),
        responseExample: JSON.stringify({
          ...realTodo,
          title: `${realTodo.title} (Updated)`,
          completed: true,
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "PATCH",
        path: "/todos/:id",
        summary: "Partially update specific fields of a todo record in the session overlay.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Todo ID to patch (e.g. ${realTodo.id} or local-<uuid>).` }
        ],
        bodyExample: JSON.stringify({ completed: true }, null, 2),
        responseExample: JSON.stringify({
          ...realTodo,
          completed: true,
          _sandbox: "updated"
        }, null, 2)
      },
      {
        method: "DELETE",
        path: "/todos/:id",
        summary: "Remove a todo record from the requesting session view. The underlying global record is unaffected for other visitors.",
        params: [
          { name: "id", in: "path", type: "string | integer", description: `Todo ID to delete (e.g. ${realTodo.id} or local-<uuid>).` }
        ],
        bodyExample: null,
        responseExample: "204 No Content"
      }
    ];
  }

  return [];
};
