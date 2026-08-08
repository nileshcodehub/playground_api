export const getTodosEndpoints = (sampleRecord = null) => {
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
        { name: "q", in: "query", type: "string", description: "Full-text search query term across title, etc." },
        { name: "user_id", in: "query", type: "integer", description: "Filter todos by owner user ID (e.g. user_id=1)." },
        { name: "completed", in: "query", type: "boolean", description: "Filter todos by completion status (true or false)." },
        { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
        { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." },
        { name: "_sort", in: "query", type: "string", description: "Field name to sort results by (e.g. title, id, completed)." },
        { name: "_order", in: "query", type: "string", description: "Sort direction: asc (default) or desc." }
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
        { name: "user_id", in: "body", type: "integer", required: true, description: "Owner user ID." },
        { name: "title", in: "body", type: "string", required: true, description: "Todo task title." },
        { name: "completed", in: "body", type: "boolean", required: false, description: "Completion status (true / false)." }
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
      responseExample: JSON.stringify({
        message: `Resource 'todos' with id '${realTodo.id}' deleted successfully from sandbox overlay`,
        id: realTodo.id,
        resource: "todos"
      }, null, 2)
    }
  ];
};
