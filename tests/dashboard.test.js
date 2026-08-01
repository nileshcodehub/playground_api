import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('10 — Session Quota & Activity Dashboard Endpoint', () => {
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

  test('GET /session/stats returns identity metadata, quota caps, and per-resource breakdown', async () => {
    // Initial GET request to get identity session cookie
    const initRes = await fetch(`${baseUrl}/users?limit=1`);
    const cookie = initRes.headers.get('set-cookie');

    // Perform a POST mutation to create a post in session
    await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie
      },
      body: JSON.stringify({ title: 'Dashboard Test Post', body: 'Test body', userId: 1 })
    });

    // Fetch session stats
    const statsRes = await fetch(`${baseUrl}/session/stats`, {
      headers: { Cookie: cookie }
    });

    assert.equal(statsRes.status, 200);

    const json = await statsRes.json();
    assert.ok(json.identity.id);
    assert.equal(json.quota.maxCreatedPerResource, 30);
    assert.ok(json.stats.totalRecords >= 1);
    assert.equal(json.stats.byResource.posts.created, 1);
    assert.equal(json.stats.byResource.posts.quotaUsed, '1 / 30');
  });
});
