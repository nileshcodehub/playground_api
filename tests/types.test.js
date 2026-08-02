import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('TypeScript Type Definitions (.d.ts / GET /types/ts)', () => {
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

  test('GET /types/ts returns 200 OK with raw TypeScript declarations', async () => {
    const res = await fetch(`${baseUrl}/types/ts`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('export interface User'));
    assert.ok(text.includes('export interface Post'));
    assert.ok(text.includes('export interface Comment'));
    assert.ok(text.includes('export interface Todo'));
    assert.ok(text.includes('export interface PaginatedResponse'));
  });

  test('GET /downloads/playground-api.d.ts downloads .d.ts file attachment', async () => {
    const res = await fetch(`${baseUrl}/downloads/playground-api.d.ts`);
    assert.equal(res.status, 200);
    const disposition = res.headers.get('content-disposition');
    assert.ok(disposition && disposition.includes('playground-api.d.ts'));
    const text = await res.text();
    assert.ok(text.includes('export interface User'));
  });
});
