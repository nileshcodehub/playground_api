import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('03 — Network Delay & Error Simulation', () => {
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

  test('X-Simulate-Delay header applies artificial delay', async () => {
    const startTime = Date.now();
    const res = await fetch(`${baseUrl}/users?limit=1`, {
      headers: {
        'X-Simulate-Delay': '250'
      }
    });
    const duration = Date.now() - startTime;

    assert.equal(res.status, 200);
    assert.ok(duration >= 200, `Expected duration >= 200ms, actual was ${duration}ms`);
  });

  test('?_delay=250 query parameter applies artificial delay', async () => {
    const startTime = Date.now();
    const res = await fetch(`${baseUrl}/users?limit=1&_delay=250`);
    const duration = Date.now() - startTime;

    assert.equal(res.status, 200);
    assert.ok(duration >= 200, `Expected duration >= 200ms, actual was ${duration}ms`);
  });

  test('X-Simulate-Status header forces artificial HTTP error response', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: {
        'X-Simulate-Status': '500'
      }
    });
    assert.equal(res.status, 500);

    const json = await res.json();
    assert.ok(json.error);
    assert.equal(json.error.status, 500);
    assert.ok(json.error.message.includes('500'));
  });

  test('?_status=403 query parameter forces artificial HTTP error response', async () => {
    const res = await fetch(`${baseUrl}/users?_status=403`);
    assert.equal(res.status, 403);

    const json = await res.json();
    assert.ok(json.error);
    assert.equal(json.error.status, 403);
    assert.ok(json.error.message.includes('403'));
  });

  test('Simulation query params (_delay, _status) are not treated as database filters', async () => {
    const res = await fetch(`${baseUrl}/users?_delay=50`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length > 0);
  });
});
