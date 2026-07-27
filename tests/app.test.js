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
});
