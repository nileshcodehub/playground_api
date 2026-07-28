import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('Resource API Routes', () => {
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

  test('GET /users returns paginated list of users', async () => {
    const response = await fetch(`${baseUrl}/users`);
    assert.equal(response.status, 200);
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      identityCookie = setCookie.split(';')[0];
    }
    const json = await response.json();
    assert.ok(Array.isArray(json.data), 'Expected json.data to be an array');
    assert.ok(json.pagination, 'Expected json.pagination object');
    assert.ok(json.data.length > 0, 'Expected non-empty data array');
  });

  test('GET /users/1 returns single user', async () => {
    const response = await fetch(`${baseUrl}/users/1`, {
      headers: { Cookie: identityCookie }
    });
    assert.equal(response.status, 200);
    const user = await response.json();
    assert.equal(user.id, 1);
  });

  test('GET /users/99999 returns 404 for non-existent user', async () => {
    const response = await fetch(`${baseUrl}/users/99999`, {
      headers: { Cookie: identityCookie }
    });
    assert.equal(response.status, 404);
  });

  test('POST /users simulates creating a user (sandboxed mutation)', async () => {
    const newUser = { name: 'Test User', username: 'testuser', email: 'test@example.com' };
    const response = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify(newUser)
    });
    assert.equal(response.status, 201);
    const created = await response.json();
    assert.ok(created.id);
    assert.equal(created.name, 'Test User');
  });

  test('GET /posts returns paginated list of posts', async () => {
    const response = await fetch(`${baseUrl}/posts`, {
      headers: { Cookie: identityCookie }
    });
    assert.equal(response.status, 200);
    const json = await response.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.pagination);
  });

  test('GET /comments returns paginated list of comments', async () => {
    const response = await fetch(`${baseUrl}/comments`, {
      headers: { Cookie: identityCookie }
    });
    assert.equal(response.status, 200);
    const json = await response.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.pagination);
  });

  test('GET /todos returns paginated list of todos', async () => {
    const response = await fetch(`${baseUrl}/todos`, {
      headers: { Cookie: identityCookie }
    });
    assert.equal(response.status, 200);
    const json = await response.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.pagination);
  });
});
