export const getPostsEndpoints = (sampleRecord = null) => {
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
        { name: "q", in: "query", type: "string", description: "Full-text search query term across title, body, etc." },
        { name: "user_id", in: "query", type: "integer", description: "Filter posts by author user ID (e.g. user_id=1)." },
        { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
        { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." },
        { name: "_sort", in: "query", type: "string", description: "Field name to sort results by (e.g. title, id, user_id)." },
        { name: "_order", in: "query", type: "string", description: "Sort direction: asc (default) or desc." }
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
        { name: "user_id", in: "body", type: "integer", required: true, description: "Author user ID." },
        { name: "title", in: "body", type: "string", required: true, description: "Post title." },
        { name: "body", in: "body", type: "string", required: true, description: "Post body text content." }
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
      responseExample: JSON.stringify({
        message: `Resource 'posts' with id '${realPost.id}' deleted successfully from sandbox overlay`,
        id: realPost.id,
        resource: "posts"
      }, null, 2)
    },
    {
      method: "GET",
      path: "/posts/:postId/comments",
      summary: "Retrieve all comments linked directly to a specific blog post.",
      params: [
        { name: "postId", in: "path", type: "string | integer", description: "Target post ID (e.g. 1 or local-<uuid>)." },
        { name: "page", in: "query", type: "integer", description: "Page number (1-indexed)." },
        { name: "limit", in: "query", type: "integer", description: "Comments per page." },
        { name: "q", in: "query", type: "string", description: "Search query across comment body." }
      ],
      bodyExample: null,
      responseExample: JSON.stringify({
        data: [
          { id: 1, post_id: 1, name: "id labore ex et quam laborum", email: "Eliseo@gardner.biz", body: "laudantium..." }
        ],
        pagination: { page: 1, limit: 10, total: 5, totalPages: 1, hasNextPage: false, hasPrevPage: false }
      }, null, 2)
    }
  ];
};
