export const getUsersEndpoints = (sampleRecord = null) => {
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
        { name: "q", in: "query", type: "string", description: "Full-text search query term across name, username, email, etc." },
        { name: "page", in: "query", type: "integer", description: "Page number (1-indexed, default 1)." },
        { name: "limit", in: "query", type: "integer", description: "Number of records per page (default 10, max 30)." },
        { name: "_sort", in: "query", type: "string", description: "Field name to sort results by (e.g. name, id, username, email)." },
        { name: "_order", in: "query", type: "string", description: "Sort direction: asc (default) or desc." }
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
};
