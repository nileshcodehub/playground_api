export const getCommentsEndpoints = (sampleRecord = null) => {
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
        { name: "q", in: "query", type: "string", description: "Full-text search query term across name, email, body, etc." },
        { name: "post_id", in: "query", type: "integer", description: "Filter comments by parent post ID (e.g. post_id=1)." },
        { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
        { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." },
        { name: "_sort", in: "query", type: "string", description: "Field name to sort results by (e.g. name, email, id)." },
        { name: "_order", in: "query", type: "string", description: "Sort direction: asc (default) or desc." }
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
};
