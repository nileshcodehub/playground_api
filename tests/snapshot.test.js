import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('06 — Session Sandbox Snapshot Export & Import (/session/export, /session/import)', () => {
  let server;
  let baseUrl;
  let identityToken;

  before((_, done) => {
    server = app.listen(0, async () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;

      // Initialize an active identity session
      const createRes = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Snapshot User', username: 'snapshot_user', email: 'snapshot@test.com' })
      });
      identityToken = createRes.headers.get('x-playground-identity');
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  test('GET /session/export returns JSON snapshot of session overlay', async () => {
    const res = await fetch(`${baseUrl}/session/export`, {
      headers: { 'X-Playground-Identity': identityToken }
    });

    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('application/json'));

    const snapshot = await res.json();
    assert.equal(snapshot.version, '1.0');
    assert.ok(Array.isArray(snapshot.records));
    assert.ok(snapshot.stats.totalRecords >= 1);
  });

  test('GET /session/export?resource=users filters records to target resource', async () => {
    const res = await fetch(`${baseUrl}/session/export?resource=users`, {
      headers: { 'X-Playground-Identity': identityToken }
    });

    assert.equal(res.status, 200);
    const snapshot = await res.json();
    assert.equal(snapshot.targetResource, 'users');
    assert.ok(snapshot.records.every(r => r.resource === 'users'));
  });

  test('POST /session/import restores snapshot into session overlay', async () => {
    const exportRes = await fetch(`${baseUrl}/session/export`, {
      headers: { 'X-Playground-Identity': identityToken }
    });
    const snapshot = await exportRes.json();

    // Reset session first
    await fetch(`${baseUrl}/session/reset`, {
      method: 'DELETE',
      headers: { 'X-Playground-Identity': identityToken }
    });

    // Import snapshot back
    const importRes = await fetch(`${baseUrl}/session/import?strategy=replace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': identityToken
      },
      body: JSON.stringify(snapshot)
    });

    assert.equal(importRes.status, 200);
    const importResult = await importRes.json();
    assert.ok(importResult.importedRecords >= 1);
    assert.equal(importResult.strategy, 'replace');

    // Verify imported record exists in GET /users
    const usersRes = await fetch(`${baseUrl}/users`, {
      headers: { 'X-Playground-Identity': identityToken }
    });
    const usersData = await usersRes.json();
    assert.ok(usersData.data.some(u => u.username === 'snapshot_user'));
  });

  test('POST /session/import?resource=comments rejects snapshot with resource mismatch (400 Bad Request)', async () => {
    const snapshot = {
      version: '1.0',
      records: [
        { resource: 'users', op: 'create', data: { name: 'Mismatched User' } }
      ]
    };

    const res = await fetch(`${baseUrl}/session/import?resource=comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': identityToken
      },
      body: JSON.stringify(snapshot)
    });

    assert.equal(res.status, 400);
    const errPayload = await res.json();
    assert.ok((errPayload.error || errPayload.message).includes('Resource mismatch'));
  });

  test('GET /docs/session renders Session Snapshot documentation page', async () => {
    const res = await fetch(`${baseUrl}/docs/session`);
    assert.equal(res.status, 200);

    const html = await res.text();
    assert.ok(html.includes('/session/export'));
    assert.ok(html.includes('/session/import'));
  });
});
