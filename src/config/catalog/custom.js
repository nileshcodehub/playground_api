export const getCustomEndpoints = () => {
  return [
    {
      method: 'GET',
      path: '/custom',
      title: 'List Active Custom Collections',
      description: 'Returns a summary of all active dynamic custom resource collections in your session sandbox with record counts.',
      params: [],
      bodyExample: null,
      responseExample: JSON.stringify({
        totalCollections: 2,
        collections: [
          { name: "products", endpoint: "/custom/products", count: 3, lastUpdated: "2026-08-02T23:30:00.000Z" },
          { name: "orders", endpoint: "/custom/orders", count: 2, lastUpdated: "2026-08-02T23:30:00.000Z" }
        ]
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/custom/seed',
      title: 'Seed Domain Mock Data Template',
      description: 'Instantly populates pre-built domain collections into your session sandbox with one request.',
      params: [
        { name: 'template', type: 'String (Query)', desc: 'Domain template ("ecommerce", "crm", "saas", "healthcare"). Default: "ecommerce".' }
      ],
      bodyExample: JSON.stringify({ template: "ecommerce" }, null, 2),
      responseExample: JSON.stringify({
        message: "Seeded 5 records across custom collections: products, orders.",
        template: "ecommerce",
        collections: ["products", "orders"],
        totalSeeded: 5
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/custom/:collection',
      title: 'Query Custom Collection Items',
      description: 'Retrieves a paginated list of items from any dynamic custom collection. Supports page, limit, full-text search (?q=), and sorting (?_sort=).',
      params: [
        { name: 'collection', type: 'String (Path)', desc: 'Custom collection name (e.g. products, orders, notes, leads).' },
        { name: 'page', type: 'Integer (Query)', desc: 'Page number (default 1).' },
        { name: 'limit', type: 'Integer (Query)', desc: 'Records per page (default 10).' },
        { name: 'q', type: 'String (Query)', desc: 'Case-insensitive full-text search term.' },
        { name: '_sort', type: 'String (Query)', desc: 'Field name to sort by.' }
      ],
      bodyExample: null,
      responseExample: JSON.stringify({
        data: [
          { id: "local-a1b2c3d4", name: 'MacBook Pro M3', price: 2499, category: 'Laptops', createdAt: "2026-08-02T23:30:00.000Z", _sandbox: "created" }
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false }
      }, null, 2)
    },
    {
      method: 'POST',
      path: '/custom/:collection',
      title: 'Create Custom Collection Record',
      description: 'Creates a new custom record in any arbitrary collection with automatic ID, createdAt, and updatedAt metadata attachment.',
      params: [
        { name: 'collection', type: 'String (Path)', desc: 'Custom collection name (e.g. products, orders).' }
      ],
      bodyExample: JSON.stringify({ name: "Custom Product Item", price: 99.99, inStock: true }, null, 2),
      responseExample: JSON.stringify({
        id: "local-f9e8d7c6-5432-10ab",
        name: "Custom Product Item",
        price: 99.99,
        inStock: true,
        createdAt: "2026-08-02T23:30:00.000Z",
        updatedAt: "2026-08-02T23:30:00.000Z",
        _sandbox: "created"
      }, null, 2)
    },
    {
      method: 'DELETE',
      path: '/custom/:collection/:id',
      title: 'Delete Custom Collection Record',
      description: 'Removes a custom record from your session sandbox.',
      params: [
        { name: 'collection', type: 'String (Path)', desc: 'Custom collection name.' },
        { name: 'id', type: 'String (Path)', desc: 'Record ID (e.g. local-uuid).' }
      ],
      bodyExample: null,
      responseExample: JSON.stringify({
        message: "Record 'local-f9e8d7c6' removed from custom collection 'products'"
      }, null, 2)
    }
  ];
};
