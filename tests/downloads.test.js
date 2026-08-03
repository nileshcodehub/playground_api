import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('18 — Multi-Format API Collection & Schema Downloads', () => {
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

  test('GET /downloads/openapi.json returns valid OpenAPI 3.0 specification', async () => {
    const res = await fetch(`${baseUrl}/downloads/openapi.json`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api.openapi.json'));

    const json = await res.json();
    assert.equal(json.openapi, '3.0.3');
    assert.equal(json.info.title, 'Playground API');
    assert.ok(json.paths['/users']);
    assert.ok(json.paths['/posts']);
  });

  test('GET /downloads/postman.json returns valid Postman v2.1 collection', async () => {
    const res = await fetch(`${baseUrl}/downloads/postman.json`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api.postman_collection.json'));

    const json = await res.json();
    assert.equal(json.info.name, 'Playground API Collection');
    assert.ok(Array.isArray(json.item));
    assert.ok(json.item.length > 0);
  });

  test('GET /downloads/bruno.json returns valid Bruno API collection', async () => {
    const res = await fetch(`${baseUrl}/downloads/bruno.json`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api.bruno_collection.json'));

    const json = await res.json();
    assert.equal(json.name, 'Playground API (Bruno)');
    assert.ok(Array.isArray(json.items));
  });

  test('GET /downloads/insomnia.json returns valid Insomnia v4 collection', async () => {
    const res = await fetch(`${baseUrl}/downloads/insomnia.json`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api.insomnia_collection.json'));

    const json = await res.json();
    assert.equal(json.__export_format, 4);
    assert.ok(Array.isArray(json.resources));
  });

  test('GET /downloads/postman.json?resource=users returns collection filtered for users only', async () => {
    const res = await fetch(`${baseUrl}/downloads/postman.json?resource=users`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api-users.postman_collection.json'));

    const json = await res.json();
    assert.equal(json.info.name, 'Playground API Collection — Users');
    assert.equal(json.item.length, 1);
    assert.equal(json.item[0].name, 'USERS');
  });

  test('GET /downloads/openapi.json?resource=posts returns OpenAPI spec filtered for posts only', async () => {
    const res = await fetch(`${baseUrl}/downloads/openapi.json?resource=posts`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api-posts.openapi.json'));

    const json = await res.json();
    assert.equal(json.info.title, 'Playground API — Posts');
    assert.ok(json.paths['/posts']);
    assert.equal(json.paths['/users'], undefined);
  });

  test('GET /downloads/openapi.json?resource=auth returns OpenAPI spec filtered for auth endpoints', async () => {
    const res = await fetch(`${baseUrl}/downloads/openapi.json?resource=auth`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-disposition').includes('playground-api-auth.openapi.json'));

    const json = await res.json();
    assert.equal(json.info.title, 'Playground API — Auth');
    assert.ok(json.paths['/auth/login']);
    assert.ok(json.paths['/auth/register']);
    assert.ok(json.paths['/auth/me']);
  });
});
