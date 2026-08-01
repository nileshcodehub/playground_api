import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('07 — Vercel Cron Cleanup Endpoint', () => {
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

  test('GET /api/cron/cleanup executes identity cleanup and returns JSON summary', async () => {
    const res = await fetch(`${baseUrl}/api/cron/cleanup`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(typeof json.purgedCount === 'number');
    assert.ok(json.message.includes('purged'));
    assert.ok(json.timestamp);
  });
});
