import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface GraphqlSchemaPageProps {
  params: Promise<{ schema: string }>;
}

export function generateStaticParams() {
  return [
    { schema: 'posts' },
    { schema: 'comments' },
    { schema: 'users' },
    { schema: 'todos' },
    { schema: 'auth' },
  ];
}

export interface GraphqlOp {
  title: string;
  desc: string;
  query: string;
  response: string;
}

export interface GraphqlSchemaDetail {
  id: string;
  name: string;
  description: string;
  operations: GraphqlOp[];
  pagination: {
    desc: string;
    query: string;
    response: string;
    params: { name: string; type: string; desc: string }[];
  };
  typeFields: { field: string; type: string; desc: string }[];
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

const graphqlDocsData: Record<string, GraphqlSchemaDetail> = {
  posts: {
    id: 'posts',
    name: 'Posts GraphQL API',
    description: 'Query, mutate, and filter Post entities with relational author and comment data via GraphQL.',
    operations: [
      {
        title: 'Get all posts',
        desc: 'Fetch a list of posts from global seed data merged with identity sandbox overlays.',
        query: `query GetAllPosts {
  posts {
    id
    title
    body
    user_id
  }
}`,
        response: `{
  "data": {
    "posts": [
      {
        "id": "1",
        "title": "Getting Started with Playground API",
        "body": "Playground API provides instant sandboxed mock endpoints...",
        "user_id": "1"
      },
      {
        "id": "2",
        "title": "Building React Apps with Sandboxed APIs",
        "body": "Test mutations without touching backend databases...",
        "user_id": "1"
      }
    ]
  }
}`,
      },
      {
        title: 'Get a single post',
        desc: 'Retrieve details of a specific post by integer ID or local sandbox string ID.',
        query: `query GetSinglePost {
  post(id: "1") {
    id
    title
    body
    user_id
  }
}`,
        response: `{
  "data": {
    "post": {
      "id": "1",
      "title": "Getting Started with Playground API",
      "body": "Playground API provides instant sandboxed mock endpoints...",
      "user_id": "1"
    }
  }
}`,
      },
      {
        title: 'Get post with nested user and comments',
        desc: 'Perform multi-level relational selection fetching author user profile and comments list in one request.',
        query: `query GetPostWithRelations {
  post(id: "1") {
    id
    title
    user {
      id
      name
      email
    }
    comments {
      id
      name
      email
      body
    }
  }
}`,
        response: `{
  "data": {
    "post": {
      "id": "1",
      "title": "Getting Started with Playground API",
      "user": {
        "id": "1",
        "name": "Leanne Graham",
        "email": "Sincere@april.biz"
      },
      "comments": [
        {
          "id": "1",
          "name": "id labore ex et quam laborum",
          "email": "Eliseo@gardner.biz",
          "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
        }
      ]
    }
  }
}`,
      },
      {
        title: 'Create a post',
        desc: 'Execute a createPost mutation. The created post is stored in your identity session sandbox overlay and prepended to posts list.',
        query: `mutation CreatePost {
  createPost(user_id: "1", title: "New Sandboxed GraphQL Post", body: "Created via GraphQL mutation") {
    id
    title
    body
    user_id
  }
}`,
        response: `{
  "data": {
    "createPost": {
      "id": "local-f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      "title": "New Sandboxed GraphQL Post",
      "body": "Created via GraphQL mutation",
      "user_id": "1"
    }
  }
}`,
      },
      {
        title: 'Update a post',
        desc: 'Execute updatePost mutation to modify fields of an existing post row in your sandbox overlay.',
        query: `mutation UpdatePost {
  updatePost(id: "1", title: "Updated Post Title via GraphQL", body: "Modified body text") {
    id
    title
    body
  }
}`,
        response: `{
  "data": {
    "updatePost": {
      "id": "1",
      "title": "Updated Post Title via GraphQL",
      "body": "Modified body text"
    }
  }
}`,
      },
      {
        title: 'Delete a post',
        desc: 'Execute deletePost mutation to remove a post from your session overlay view.',
        query: `mutation DeletePost {
  deletePost(id: "1")
}`,
        response: `{
  "data": {
    "deletePost": true
  }
}`,
      },
    ],
    pagination: {
      desc: 'Limit and paginate posts query using page, limit, user_id, q search, and sorting arguments.',
      query: `query PaginatePosts {
  posts(page: 1, limit: 2, user_id: "1", q: "Getting", _sort: "title", _order: "asc") {
    id
    title
    user_id
  }
}`,
      response: `{
  "data": {
    "posts": [
      {
        "id": "1",
        "title": "Getting Started with Playground API",
        "user_id": "1"
      }
    ]
  }
}`,
      params: [
        { name: 'page', type: 'Int', desc: 'Page number for pagination (default: 1).' },
        { name: 'limit', type: 'Int', desc: 'Number of items per page (default: 10, max: 30).' },
        { name: 'user_id', type: 'ID', desc: 'Filter posts authored by user ID.' },
        { name: 'q', type: 'String', desc: 'Full-text search query across title & body.' },
        { name: '_sort', type: 'String', desc: 'Field name to sort by (e.g. title, id).' },
        { name: '_order', type: 'String', desc: 'Sort direction ("asc" or "desc").' },
      ],
    },
    typeFields: [
      { field: 'id', type: 'ID!', desc: 'Unique post identifier (Integer for global, local-uuid string for sandbox).' },
      { field: 'user_id', type: 'ID!', desc: 'Author user ID foreign key.' },
      { field: 'title', type: 'String!', desc: 'Headline title of the post.' },
      { field: 'body', type: 'String!', desc: 'Main text body content.' },
      { field: 'user', type: 'User', desc: 'Relational author User object.' },
      { field: 'comments', type: '[Comment!]!', desc: 'List of relational comments linked to this post.' },
    ],
    prevPage: { title: 'GraphiQL IDE Explorer', href: '/docs/graphql' },
    nextPage: { title: 'Comments GraphQL Schema', href: '/docs/graphql/comments' },
  },

  comments: {
    id: 'comments',
    name: 'Comments GraphQL API',
    description: 'Query and mutate Comment entities linked to posts via GraphQL.',
    operations: [
      {
        title: 'Get all comments',
        desc: 'Fetch comments list across all blog posts.',
        query: `query GetAllComments {
  comments(limit: 5) {
    id
    post_id
    name
    email
    body
  }
}`,
        response: `{
  "data": {
    "comments": [
      {
        "id": "1",
        "post_id": "1",
        "name": "id labore ex et quam laborum",
        "email": "Eliseo@gardner.biz",
        "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos"
      }
    ]
  }
}`,
      },
      {
        title: 'Get comment with parent post',
        desc: 'Fetch comment record along with relational parent Post object.',
        query: `query GetCommentWithPost {
  comment(id: "1") {
    id
    name
    email
    body
    post {
      id
      title
    }
  }
}`,
        response: `{
  "data": {
    "comment": {
      "id": "1",
      "name": "id labore ex et quam laborum",
      "email": "Eliseo@gardner.biz",
      "body": "laudantium enim quasi...",
      "post": {
        "id": "1",
        "title": "Getting Started with Playground API"
      }
    }
  }
}`,
      },
      {
        title: 'Create a comment',
        desc: 'Add a new comment mutation linked to a post_id.',
        query: `mutation CreateComment {
  createComment(post_id: "1", name: "Awesome GraphQL API", email: "dev@playground.dev", body: "Fast and easy!") {
    id
    post_id
    name
    email
    body
  }
}`,
        response: `{
  "data": {
    "createComment": {
      "id": "local-9b1deb4d",
      "post_id": "1",
      "name": "Awesome GraphQL API",
      "email": "dev@playground.dev",
      "body": "Fast and easy!"
    }
  }
}`,
      },
    ],
    pagination: {
      desc: 'Filter comments by post_id, page, and limit arguments.',
      query: `query FilterComments {
  comments(post_id: "1", page: 1, limit: 2) {
    id
    name
    email
  }
}`,
      response: `{
  "data": {
    "comments": [
      {
        "id": "1",
        "name": "id labore ex et quam laborum",
        "email": "Eliseo@gardner.biz"
      }
    ]
  }
}`,
      params: [
        { name: 'post_id', type: 'ID', desc: 'Filter comments belonging to post ID.' },
        { name: 'page', type: 'Int', desc: 'Page number.' },
        { name: 'limit', type: 'Int', desc: 'Items per page.' },
      ],
    },
    typeFields: [
      { field: 'id', type: 'ID!', desc: 'Unique comment identifier.' },
      { field: 'post_id', type: 'ID!', desc: 'Parent post ID foreign key.' },
      { field: 'name', type: 'String!', desc: 'Commenter name.' },
      { field: 'email', type: 'String!', desc: 'Commenter email address.' },
      { field: 'body', type: 'String!', desc: 'Comment text content.' },
      { field: 'post', type: 'Post', desc: 'Relational parent Post object.' },
    ],
    prevPage: { title: 'Posts GraphQL Schema', href: '/docs/graphql/posts' },
    nextPage: { title: 'Users GraphQL Schema', href: '/docs/graphql/users' },
  },

  users: {
    id: 'users',
    name: 'Users GraphQL API',
    description: 'Query user profile records with nested posts, todos, and address objects via GraphQL.',
    operations: [
      {
        title: 'Get all users',
        desc: 'Fetch paginated user list with full profile details.',
        query: `query GetAllUsers {
  users {
    id
    name
    username
    email
    phone
    website
  }
}`,
        response: `{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org"
      }
    ]
  }
}`,
      },
      {
        title: 'Get user with posts and todos',
        desc: 'Fetch single user profile with nested relational posts and todos lists.',
        query: `query GetUserWithNestedLists {
  user(id: "1") {
    id
    name
    email
    posts {
      id
      title
    }
    todos {
      id
      title
      completed
    }
  }
}`,
        response: `{
  "data": {
    "user": {
      "id": "1",
      "name": "Leanne Graham",
      "email": "Sincere@april.biz",
      "posts": [
        { "id": "1", "title": "Getting Started with Playground API" }
      ],
      "todos": [
        { "id": "1", "title": "delectus aut autem", "completed": false }
      ]
    }
  }
}`,
      },
    ],
    pagination: {
      desc: 'Paginate and search user profiles using q, page, and limit arguments.',
      query: `query SearchUsers {
  users(q: "Leanne", limit: 5) {
    id
    name
    email
  }
}`,
      response: `{
  "data": {
    "users": [
      { "id": "1", "name": "Leanne Graham", "email": "Sincere@april.biz" }
    ]
  }
}`,
      params: [
        { name: 'page', type: 'Int', desc: 'Page number.' },
        { name: 'limit', type: 'Int', desc: 'Items per page.' },
        { name: 'q', type: 'String', desc: 'Search query across name, username, and email.' },
      ],
    },
    typeFields: [
      { field: 'id', type: 'ID!', desc: 'User ID.' },
      { field: 'name', type: 'String!', desc: 'Full name.' },
      { field: 'username', type: 'String!', desc: 'Unique handle username.' },
      { field: 'email', type: 'String!', desc: 'Email address.' },
      { field: 'avatar', type: 'String', desc: 'SVG avatar helper image URL.' },
      { field: 'posts', type: '[Post!]', desc: 'List of posts created by user.' },
      { field: 'todos', type: '[Todo!]', desc: 'List of todos assigned to user.' },
    ],
    prevPage: { title: 'Comments GraphQL Schema', href: '/docs/graphql/comments' },
    nextPage: { title: 'Todos GraphQL Schema', href: '/docs/graphql/todos' },
  },

  todos: {
    id: 'todos',
    name: 'Todos GraphQL API',
    description: 'Query and mutate Todo task items via GraphQL.',
    operations: [
      {
        title: 'Get all todos',
        desc: 'Fetch task todo items.',
        query: `query GetAllTodos {
  todos(limit: 5) {
    id
    title
    completed
  }
}`,
        response: `{
  "data": {
    "todos": [
      {
        "id": "1",
        "title": "delectus aut autem",
        "completed": false
      }
    ]
  }
}`,
      },
      {
        title: 'Create a todo',
        desc: 'Add a new sandboxed todo item.',
        query: `mutation CreateTodo {
  createTodo(user_id: "1", title: "Build Next.js Frontend App", completed: true) {
    id
    title
    completed
  }
}`,
        response: `{
  "data": {
    "createTodo": {
      "id": "local-7a6b5c4d",
      "title": "Build Next.js Frontend App",
      "completed": true
    }
  }
}`,
      },
    ],
    pagination: {
      desc: 'Filter todos by user_id and completed status.',
      query: `query FilterTodos {
  todos(user_id: "1", completed: false, limit: 5) {
    id
    title
    completed
  }
}`,
      response: `{
  "data": {
    "todos": [
      { "id": "1", "title": "delectus aut autem", "completed": false }
    ]
  }
}`,
      params: [
        { name: 'user_id', type: 'ID', desc: 'Filter todos by user ID.' },
        { name: 'completed', type: 'Boolean', desc: 'Filter by completed status.' },
      ],
    },
    typeFields: [
      { field: 'id', type: 'ID!', desc: 'Todo ID.' },
      { field: 'user_id', type: 'ID!', desc: 'Assigned user ID.' },
      { field: 'title', type: 'String!', desc: 'Task description.' },
      { field: 'completed', type: 'Boolean!', desc: 'Completion status.' },
    ],
    prevPage: { title: 'Users GraphQL Schema', href: '/docs/graphql/users' },
    nextPage: { title: 'Auth GraphQL Schema', href: '/docs/graphql/auth' },
  },

  auth: {
    id: 'auth',
    name: 'Auth GraphQL API',
    description: 'Execute fake JWT login, registration mutations, and profile inspection via GraphQL.',
    operations: [
      {
        title: 'Execute login mutation',
        desc: 'Simulate user login with username/email and password to receive signed JWT access and refresh tokens.',
        query: `mutation LoginUser {
  login(username: "kminchelle", password: "password123") {
    access_token
    refresh_token
    token_type
    expires_in
    user {
      id
      name
      username
      email
    }
  }
}`,
        response: `{
  "data": {
    "login": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEs...",
      "token_type": "Bearer",
      "expires_in": 900,
      "user": {
        "id": "1",
        "name": "Leanne Graham",
        "username": "kminchelle",
        "email": "kminchelle@qq.com"
      }
    }
  }
}`,
      },
      {
        title: 'Execute register mutation',
        desc: 'Register a new mock user in your identity sandbox overlay and receive an authentication payload.',
        query: `mutation RegisterUser {
  register(name: "John Developer", username: "johndev", email: "john@playground.dev", password: "securepassword") {
    access_token
    refresh_token
    token_type
    expires_in
    user {
      id
      name
      username
      email
    }
  }
}`,
        response: `{
  "data": {
    "register": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJsb2NhbC0xMjMi...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 900,
      "user": {
        "id": "local-9b1deb4d-3b7d-4bad",
        "name": "John Developer",
        "username": "johndev",
        "email": "john@playground.dev"
      }
    }
  }
}`,
      },
    ],
    pagination: {
      desc: 'Inspect currently authenticated user profile via me query resolver using Authorization: Bearer header.',
      query: `query GetMeProfile {
  me {
    id
    name
    username
    email
    phone
    website
  }
}`,
      response: `{
  "data": {
    "me": {
      "id": "1",
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org"
    }
  }
}`,
      params: [
        { name: 'username', type: 'String', desc: 'Username handle for login mutation.' },
        { name: 'email', type: 'String', desc: 'Email address for login or register mutation.' },
        { name: 'password', type: 'String', desc: 'Password secret.' },
        { name: 'name', type: 'String!', desc: 'Full display name for registration.' },
      ],
    },
    typeFields: [
      { field: 'access_token', type: 'String!', desc: '15-minute signed JWT access token.' },
      { field: 'refresh_token', type: 'String!', desc: '7-day signed JWT refresh token.' },
      { field: 'token_type', type: 'String!', desc: 'Token type string ("Bearer").' },
      { field: 'expires_in', type: 'Int!', desc: 'Token lifetime in seconds (900s).' },
      { field: 'user', type: 'User!', desc: 'Authenticated User profile record.' },
    ],
    prevPage: { title: 'Todos GraphQL Schema', href: '/docs/graphql/todos' },
  },
};

export async function generateMetadata({ params }: GraphqlSchemaPageProps) {
  const { schema } = await params;
  const item = graphqlDocsData[schema];
  if (!item) return { title: 'GraphQL Schema Not Found' };
  return { title: item.name, description: item.description };
}

export default async function GraphqlSchemaPage({ params }: GraphqlSchemaPageProps) {
  const { schema } = await params;
  const item = graphqlDocsData[schema];

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-12 w-full max-w-none">
      {/* 1. Resource Title & Intro Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/15 text-pink-500 text-xs font-bold">
          <Icon icon="simple-icons:graphql" className="w-4 h-4" />
          GraphQL Schema Documentation
        </div>
        <h1 className="text-4xl font-black text-text-primary tracking-tight">{item.name}</h1>
        <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
      </div>

      {/* 2. Operations High-Density Blocks */}
      {item.operations.map((op) => {
        const opId = op.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <div key={op.title} id={opId} className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl font-extrabold text-text-primary tracking-tight">{op.title}</h2>
            <p className="text-xs text-text-secondary leading-relaxed">{op.desc}</p>

            <div className="grid grid-cols-1 gap-4">
              {/* Query Block */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-pink-400 uppercase">Query / Mutation</span>
                <CodeBlock
                  code={op.query}
                  language="graphql"
                  maxHeight="max-h-72"
                />
              </div>

              {/* Response Block */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Response JSON</span>
                <CodeBlock
                  code={op.response}
                  language="json"
                  maxHeight="max-h-72"
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* 3. Pagination & Filtering Section */}
      <div id="pagination" className="space-y-4 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">Pagination & Filtering</h2>
        <p className="text-xs text-text-secondary leading-relaxed">{item.pagination.desc}</p>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-pink-400 uppercase">Paginated Query</span>
            <CodeBlock
              code={item.pagination.query}
              language="graphql"
              maxHeight="max-h-72"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Paginated Response</span>
            <CodeBlock
              code={item.pagination.response}
              language="json"
              maxHeight="max-h-72"
            />
          </div>
        </div>

        {/* Arguments Table */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Query Arguments</h4>
          <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-theme text-text-primary font-bold">
                  <th className="p-3 font-mono">Argument</th>
                  <th className="p-3 font-mono">Type</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme text-text-secondary font-mono">
                {item.pagination.params.map((p) => (
                  <tr key={p.name}>
                    <td className="p-3 text-pink-400 font-bold">{p.name}</td>
                    <td className="p-3 text-text-muted">{p.type}</td>
                    <td className="p-3 font-sans text-text-secondary">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Schema Type Definition Table */}
      <div id="schema-type" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">Schema {item.name.split(' ')[0]} Type</h2>
        <div className="overflow-x-auto rounded-2xl border border-border-theme glass-panel shadow-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-theme text-text-primary font-bold">
                <th className="p-3.5 font-mono">Field</th>
                <th className="p-3.5 font-mono">Type</th>
                <th className="p-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary font-mono">
              {item.typeFields.map((tf) => (
                <tr key={tf.field}>
                  <td className="p-3.5 text-emerald-400 font-bold">{tf.field}</td>
                  <td className="p-3.5 text-pink-400">{tf.type}</td>
                  <td className="p-3.5 font-sans text-text-secondary">{tf.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Next / Prev Page Navigation Links */}
      <div className="pt-8 border-t border-border-theme flex items-center justify-between gap-4">
        {item.prevPage ? (
          <Link
            href={item.prevPage.href}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs font-bold text-text-primary transition-all group"
          >
            <Icon icon="ph:arrow-left-bold" className="w-4 h-4 text-accent-primary group-hover:-translate-x-1 transition-transform" />
            <span>Prev: {item.prevPage.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {item.nextPage && (
          <Link
            href={item.nextPage.href}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs font-bold text-text-primary transition-all group ml-auto"
          >
            <span>Next: {item.nextPage.title}</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
