import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('Developer Portal & API Studio (/docs)', () => {
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

  test('GET /docs returns 200 OK with Developer Portal & API Studio HTML', async () => {
    const res = await fetch(`${baseUrl}/docs`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Playground API Developer Portal'));
    assert.ok(html.includes('Quickstart'));
    assert.ok(html.includes('API Studio'));
    assert.ok(html.includes('GraphQL'));
  });

  test('GET / renders homepage with link to /docs', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('/docs'));
    assert.ok(html.includes('Launch Developer Portal &amp; API Studio') || html.includes('Launch Developer Portal & API Studio') || html.includes('Dev Portal'));
  });

  test('GET /docs/:resource renders consolidated resource-doc documentation page', async () => {
    const resources = ['users', 'posts', 'comments', 'todos'];
    for (const resName of resources) {
      const res = await fetch(`${baseUrl}/docs/${resName}`);
      assert.equal(res.status, 200);
      const html = await res.text();
      assert.ok(html.includes(`Export ${resName.charAt(0).toUpperCase() + resName.slice(1)} Collection`));
      assert.ok(html.includes(`openapi.json?resource=${resName}`));
    }
  });
});
