import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('17 — GraphQL Sandbox Gateway (/graphql)', () => {
  let server;
  let baseUrl;
  let identityCookie = '';

  before((_, done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  test('GET /graphql returns GraphiQL HTML IDE interface', async () => {
    const res = await fetch(`${baseUrl}/graphql`, {
      headers: { Accept: 'text/html' }
    });
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('GraphiQL'));
    assert.ok(html.includes('Playground API'));
  });

  test('POST /graphql fetches users and returns session cookie', async () => {
    const res = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            users(limit: 2) {
              id
              name
              email
            }
          }
        `
      })
    });

    assert.equal(res.status, 200);
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      identityCookie = setCookie.split(';')[0];
    }

    const payload = await res.json();
    assert.ok(payload.data);
    assert.ok(Array.isArray(payload.data.users));
    assert.equal(payload.data.users.length, 2);
    assert.ok(payload.data.users[0].id);
    assert.ok(payload.data.users[0].name);
  });

  test('POST /graphql queries single user with relational posts', async () => {
    const res = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify({
        query: `
          query GetUserWithPosts($id: ID!) {
            user(id: $id) {
              id
              name
              posts {
                id
                title
              }
            }
          }
        `,
        variables: { id: '1' }
      })
    });

    assert.equal(res.status, 200);
    const payload = await res.json();
    assert.ok(payload.data.user);
    assert.equal(String(payload.data.user.id), '1');
    assert.ok(Array.isArray(payload.data.user.posts));
  });

  test('POST /graphql mutation createPost, query post, and deletePost', async () => {
    // 1. Create post
    const createRes = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify({
        query: `
          mutation {
            createPost(user_id: "1", title: "GraphQL Created Post", body: "Testing GraphQL mutations") {
              id
              title
              user_id
            }
          }
        `
      })
    });

    assert.equal(createRes.status, 200);
    const createPayload = await createRes.json();
    assert.ok(createPayload.data.createPost);
    const newPostId = createPayload.data.createPost.id;
    assert.ok(String(newPostId).startsWith('local-'));
    assert.equal(createPayload.data.createPost.title, 'GraphQL Created Post');

    // 2. Query created post by ID
    const getRes = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify({
        query: `
          query GetSinglePost($id: ID!) {
            post(id: $id) {
              id
              title
            }
          }
        `,
        variables: { id: newPostId }
      })
    });

    assert.equal(getRes.status, 200);
    const getPayload = await getRes.json();
    assert.ok(getPayload.data.post);
    assert.equal(getPayload.data.post.id, newPostId);

    // 3. Delete created post
    const deleteRes = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify({
        query: `
          mutation DeletePost($id: ID!) {
            deletePost(id: $id)
          }
        `,
        variables: { id: newPostId }
      })
    });

    assert.equal(deleteRes.status, 200);
    const deletePayload = await deleteRes.json();
    assert.equal(deletePayload.data.deletePost, true);
  });

  test('GET /docs/graphql renders GraphQL documentation page', async () => {
    const res = await fetch(`${baseUrl}/docs/graphql`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('GraphQL Sandbox Gateway'));
    assert.ok(html.includes('Open GraphiQL IDE'));
  });

  test('POST /graphql supports auth login mutation and me query with Bearer token', async () => {
    const loginRes = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($username: String!) {
            login(username: $username) {
              access_token
              refresh_token
              user {
                id
                username
              }
            }
          }
        `,
        variables: { username: 'Bret' }
      })
    });

    assert.equal(loginRes.status, 200);
    const loginPayload = await loginRes.json();
    assert.ok(loginPayload.data.login.access_token);
    assert.equal(loginPayload.data.login.user.username.toLowerCase(), 'bret');

    const meRes = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginPayload.data.login.access_token}`
      },
      body: JSON.stringify({
        query: `
          query Me {
            me {
              id
              username
            }
          }
        `
      })
    });

    assert.equal(meRes.status, 200);
    const mePayload = await meRes.json();
    assert.equal(mePayload.data.me.username.toLowerCase(), 'bret');
  });

  test('GET /downloads/schema.graphql returns GraphQL SDL Schema download', async () => {
    const res = await fetch(`${baseUrl}/downloads/schema.graphql`);
    assert.equal(res.status, 200);
    const sdl = await res.text();
    assert.ok(sdl.includes('type User'));
    assert.ok(sdl.includes('type Post'));
    assert.ok(sdl.includes('type Comment'));
    assert.ok(sdl.includes('type Todo'));
    assert.ok(sdl.includes('type AuthPayload'));
  });
});
