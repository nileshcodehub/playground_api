import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('Rate Limiter Middleware', () => {
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

  test('Includes standard RateLimit headers on responses', async () => {
    const response = await fetch(`${baseUrl}/users`);
    assert.equal(response.status, 200);

    const limitHeader = response.headers.get('ratelimit-limit');
    const remainingHeader = response.headers.get('ratelimit-remaining');

    assert.ok(limitHeader, 'ratelimit-limit header should be present');
    assert.ok(remainingHeader, 'ratelimit-remaining header should be present');
    assert.equal(limitHeader, '60');
  });
});
