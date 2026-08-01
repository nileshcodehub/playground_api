import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('12 — Universal Full-Text Search (GET /<resource>?q=<term>)', () => {
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

  test('GET /posts?q=qui performs case-insensitive search across title & body', async () => {
    const res = await fetch(`${baseUrl}/posts?q=qui`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(json.data.length > 0);
    json.data.forEach(post => {
      const matchInTitle = post.title && post.title.toLowerCase().includes('qui');
      const matchInBody = post.body && post.body.toLowerCase().includes('qui');
      assert.ok(matchInTitle || matchInBody, `Post ID ${post.id} should contain 'qui' in title or body`);
    });
  });

  test('GET /users?q=leanne performs search across name, username, and email', async () => {
    const res = await fetch(`${baseUrl}/users?q=leanne`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.data.length, 1);
    assert.equal(json.data[0].name, 'Leanne Graham');
  });

  test('GET /posts?q=<term> searches session sandbox created records', async () => {
    const initRes = await fetch(`${baseUrl}/users?limit=1`);
    const token = initRes.headers.get('x-playground-identity');
    assert.ok(token);

    const uniqueTerm = 'ZebraXylophone99';
    await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': token
      },
      body: JSON.stringify({ title: `Post about ${uniqueTerm}`, body: 'Custom content', userId: 1 })
    });

    const searchRes = await fetch(`${baseUrl}/posts?q=${uniqueTerm}`, {
      headers: { 'X-Playground-Identity': token }
    });
    assert.equal(searchRes.status, 200);

    const json = await searchRes.json();
    assert.equal(json.data.length, 1);
    assert.ok(json.data[0].id.startsWith('local-'));
    assert.ok(json.data[0].title.includes(uniqueTerm));
  });

  test('GET /posts?user_id=1&q=est combines relational filter and search', async () => {
    const res = await fetch(`${baseUrl}/posts?user_id=1&q=est`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(json.data.length > 0);
    json.data.forEach(post => {
      assert.equal(post.user_id, 1);
      const matchInTitle = post.title && post.title.toLowerCase().includes('est');
      const matchInBody = post.body && post.body.toLowerCase().includes('est');
      assert.ok(matchInTitle || matchInBody);
    });
  });
});
