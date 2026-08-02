export const getSessionEndpoints = () => {
  return [
    {
      method: 'GET',
      path: '/session/export',
      title: 'Export Session Sandbox Snapshot JSON',
      description: 'Serializes all session sandbox overlay records (creates, updates, deletes) into a downloadable JSON snapshot file for backups or team sharing.',
      params: [
        { name: 'resource', type: 'String (Query)', desc: 'Resource filter ("all", "users", "posts", "comments", "todos"). Default: "all".' }
      ],
      responseExample: JSON.stringify({
        version: "1.0",
        exportedAt: "2026-08-02T23:00:00.000Z",
        identityId: "550e8400-e29b-41d4-a716-446655440000",
        targetResource: "all",
        stats: { totalRecords: 2, creates: 1, updates: 1, deletes: 0 },
        records: [
          { resource: "users", op: "create", targetId: null, data: { name: "Custom User" }, createdAt: "2026-08-02T22:00:00.000Z" }
        ]
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/session/import',
      title: 'Import / Restore Session Sandbox Snapshot JSON',
      description: 'Restores a previously exported JSON snapshot file or payload into your session sandbox overlay with strategy replacement or merge.',
      params: [
        { name: 'strategy', type: 'String (Query)', desc: 'Import strategy ("replace" or "merge"). Default: "replace".' },
        { name: 'resource', type: 'String (Query)', desc: 'Target resource restriction. Default: auto-detect.' }
      ],
      bodyExample: JSON.stringify({
        version: "1.0",
        records: [
          { resource: "users", op: "create", data: { name: "Restored User", email: "restored@sandbox.dev" } }
        ]
      }, null, 2),
      responseExample: JSON.stringify({
        message: "Session sandbox snapshot imported successfully.",
        importedRecords: 1,
        strategy: "replace",
        affectedResources: ["users"]
      }, null, 2)
    },
    {
      method: 'DELETE',
      path: '/session/reset',
      title: 'Purge Session Sandbox Overlay',
      description: 'Purges all created, updated, and deleted overlay mutations for your session identity, resetting your view to clean baseline global data.',
      params: [],
      bodyExample: null,
      responseExample: JSON.stringify({
        message: "Session sandbox overlay purged successfully.",
        purgedRecords: 3
      }, null, 2)
    }
  ];
};
