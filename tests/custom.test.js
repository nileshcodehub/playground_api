import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('05 — Dynamic Custom Resources Engine (/custom/:collection)', () => {
  let server;
  let baseUrl;
  let identityToken;

  before((_, done) => {
    server = app.listen(0, async () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;

      // Initialize active identity session
      const createRes = await fetch(`${baseUrl}/custom`, {
        headers: { 'Content-Type': 'application/json' }
      });
      identityToken = createRes.headers.get('x-playground-identity');
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  test('GET /custom returns empty collection summary for fresh session', async () => {
    const res = await fetch(`${baseUrl}/custom`, {
      headers: { 'X-Playground-Identity': identityToken }
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(typeof data.totalCollections, 'number');
    assert.ok(Array.isArray(data.collections));
  });

  test('POST /custom/seed?template=ecommerce seeds products and orders collections', async () => {
    const res = await fetch(`${baseUrl}/custom/seed?template=ecommerce`, {
      method: 'POST',
      headers: { 'X-Playground-Identity': identityToken }
    });

    assert.equal(res.status, 201);
    const result = await res.json();
    assert.equal(result.template, 'ecommerce');
    assert.ok(result.totalSeeded >= 5);
    assert.ok(result.collections.includes('products'));
    assert.ok(result.collections.includes('orders'));
  });

  test('GET /custom lists active seeded collections', async () => {
    const res = await fetch(`${baseUrl}/custom`, {
      headers: { 'X-Playground-Identity': identityToken }
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.totalCollections >= 2);
    assert.ok(data.collections.some(c => c.name === 'products'));
  });

  test('GET /custom/products supports search, pagination, and sorting', async () => {
    const res = await fetch(`${baseUrl}/custom/products?q=macbook`, {
      headers: { 'X-Playground-Identity': identityToken }
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 1);
    assert.ok(data.data[0].name.toLowerCase().includes('macbook'));
  });

  test('POST /custom/notes creates custom record with auto-enriched metadata', async () => {
    const res = await fetch(`${baseUrl}/custom/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': identityToken
      },
      body: JSON.stringify({ title: 'Dynamic Note Title', content: 'Testing dynamic custom resources.' })
    });

    assert.equal(res.status, 201);
    const created = await res.json();
    assert.ok(created.id.startsWith('local-'));
    assert.ok(created.createdAt);
    assert.ok(created.updatedAt);
    assert.equal(created.title, 'Dynamic Note Title');

    // GET by ID
    const getRes = await fetch(`${baseUrl}/custom/notes/${created.id}`, {
      headers: { 'X-Playground-Identity': identityToken }
    });
    assert.equal(getRes.status, 200);
    const fetched = await getRes.json();
    assert.equal(fetched.title, 'Dynamic Note Title');

    // DELETE by ID
    const delRes = await fetch(`${baseUrl}/custom/notes/${created.id}`, {
      method: 'DELETE',
      headers: { 'X-Playground-Identity': identityToken }
    });
    assert.equal(delRes.status, 200);
  });

  test('GET /docs/custom renders Dynamic Custom Resources documentation page', async () => {
    const res = await fetch(`${baseUrl}/docs/custom`);
    assert.equal(res.status, 200);

    const html = await res.text();
    assert.ok(html.includes('/custom/:collection'));
    assert.ok(html.includes('/custom/seed'));
  });
});
