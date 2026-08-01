import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('01 & 13 — Relational Sub-Resource Filtering & Dynamic Sorting', () => {
  let server;
  let baseUrl;

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

  test('GET /posts?user_id=1 filters posts by user_id', async () => {
    const res = await fetch(`${baseUrl}/posts?user_id=1`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
    json.data.forEach(post => {
      assert.equal(post.user_id, 1);
    });
  });

  test('GET /users/1/posts nested route returns posts for user 1', async () => {
    const res = await fetch(`${baseUrl}/users/1/posts`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
    json.data.forEach(post => {
      assert.equal(post.user_id, 1);
    });
  });

  test('GET /todos?completed=true filters todos by boolean completed status', async () => {
    const res = await fetch(`${baseUrl}/todos?completed=true`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
    json.data.forEach(todo => {
      assert.equal(todo.completed, true);
    });
  });

  test('GET /comments?post_id=1 filters comments by parent post_id', async () => {
    const res = await fetch(`${baseUrl}/comments?post_id=1`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
    json.data.forEach(comment => {
      assert.equal(comment.post_id, 1);
    });
  });

  test('GET /posts/1/comments nested route returns comments for post 1', async () => {
    const res = await fetch(`${baseUrl}/posts/1/comments`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
    json.data.forEach(comment => {
      assert.equal(comment.post_id, 1);
    });
  });

  test('GET /users?_sort=name&_order=asc sorts users alphabetically ascending by name', async () => {
    const res = await fetch(`${baseUrl}/users?_sort=name&_order=asc&limit=10`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 2);
    
    const names = json.data.map(u => u.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    assert.deepEqual(names, sortedNames);
  });

  test('GET /users?_sort=name&_order=desc sorts users alphabetically descending by name', async () => {
    const res = await fetch(`${baseUrl}/users?_sort=name&_order=desc&limit=10`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 2);
    
    const names = json.data.map(u => u.name);
    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
    assert.deepEqual(names, sortedNames);
  });

  test('GET /posts?user_id=1&_sort=id&_order=desc combines relational filtering and dynamic sorting', async () => {
    const res = await fetch(`${baseUrl}/posts?user_id=1&_sort=id&_order=desc`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 2);
    
    json.data.forEach(post => {
      assert.equal(post.user_id, 1);
    });

    const ids = json.data.map(p => typeof p.id === 'number' ? p.id : 0);
    for (let i = 0; i < ids.length - 1; i++) {
      assert.ok(ids[i] >= ids[i + 1], `Expected ${ids[i]} >= ${ids[i + 1]}`);
    }
  });
});
