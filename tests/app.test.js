import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('App & Core Routes', () => {
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

  test('GET / returns HTTP 200 and renders HTML docs', async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    const contentType = response.headers.get('content-type');
    assert.match(contentType, /text\/html/);
    const text = await response.text();
    assert.match(text, /Playground API/i);
  });

  test('GET /docs returns HTTP 200 and renders HTML docs', async () => {
    const response = await fetch(`${baseUrl}/docs`);
    assert.equal(response.status, 200);
    const contentType = response.headers.get('content-type');
    assert.match(contentType, /text\/html/);
  });

  test('GET /non-existent-route returns 404 JSON error', async () => {
    const response = await fetch(`${baseUrl}/non-existent-route`);
    assert.equal(response.status, 404);
    const json = await response.json();
    assert.ok(json.error);
    assert.match(json.error, /Cannot find \/non-existent-route/);
  });

  test('Sets identity cookie pg_identity on initial request', async () => {
    const response = await fetch(`${baseUrl}/users`);
    const setCookie = response.headers.get('set-cookie');
    assert.ok(setCookie, 'Expected set-cookie header in response');
    assert.match(setCookie, /pg_identity=/);
  });

  test('GET /health returns HTTP 200 and system health metrics JSON', async () => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    const json = await response.json();
    assert.equal(json.status, 'ok');
    assert.equal(typeof json.timestamp, 'string');
    assert.equal(typeof json.uptimeSeconds, 'number');
    assert.equal(json.database.status, 'connected');
    assert.equal(typeof json.database.latencyMs, 'number');
    assert.equal(typeof json.activeIdentities, 'number');
    assert.equal(typeof json.memory.rssMb, 'number');
    assert.equal(typeof json.memory.heapUsedMb, 'number');
  });
});

