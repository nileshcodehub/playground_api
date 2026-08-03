import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('16 — Dynamic SVG Avatars & Thumbnails (/public/avatars, /public/thumbnails)', () => {
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

  test('GET /public/avatars/bret.svg returns HTTP 200 OK with SVG avatar', async () => {
    const res = await fetch(`${baseUrl}/public/avatars/bret.svg`);

    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('image/svg+xml'));
    assert.ok(res.headers.get('cache-control').includes('public, max-age=86400'));

    const svg = await res.text();
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('BR'));
  });

  test('GET /public/avatars/Leanne%20Graham returns initials LG', async () => {
    const res = await fetch(`${baseUrl}/public/avatars/Leanne%20Graham`);

    assert.equal(res.status, 200);
    const svg = await res.text();
    assert.ok(svg.includes('LG'));
  });

  test('GET /public/thumbnails/post-1.svg returns HTTP 200 OK with SVG thumbnail', async () => {
    const res = await fetch(`${baseUrl}/public/thumbnails/post-1.svg`);

    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('image/svg+xml'));

    const svg = await res.text();
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Post #1'));
  });

  test('GET /users/1 includes enriched avatar URL', async () => {
    const res = await fetch(`${baseUrl}/users/1`);
    assert.equal(res.status, 200);

    const user = await res.json();
    assert.ok(user.avatar);
    assert.ok(user.avatar.includes('/public/avatars/'));
  });

  test('GET /posts/1 includes enriched thumbnail URL', async () => {
    const res = await fetch(`${baseUrl}/posts/1`);
    assert.equal(res.status, 200);

    const post = await res.json();
    assert.ok(post.thumbnail);
    assert.ok(post.thumbnail.includes('/public/thumbnails/'));
  });

  test('GET /docs/media renders Media & Avatars documentation page', async () => {
    const res = await fetch(`${baseUrl}/docs/media`);
    assert.equal(res.status, 200);

    const html = await res.text();
    assert.ok(html.includes('/public/avatars/:seed.svg'));
    assert.ok(html.includes('/public/thumbnails/:seed.svg'));
  });
});
