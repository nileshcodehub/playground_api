import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('Reset Session Sandbox API (/session/reset)', () => {
  let server;
  let baseUrl;
  let identityCookie = '';

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

  test('POST /users creates local sandbox record', async () => {
    // Initial GET to acquire identity cookie
    const getRes = await fetch(`${baseUrl}/users`);
    const setCookie = getRes.headers.get('set-cookie');
    if (setCookie) {
      identityCookie = setCookie.split(';')[0];
    }

    const createRes = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify({ name: 'Sandbox User', username: 'sandboxuser', email: 'sandbox@test.com' })
    });
    assert.equal(createRes.status, 201);
    const created = await createRes.json();
    assert.ok(created.id.startsWith('local-'));

    // Verify GET /users now includes the created sandbox item at the top
    const listRes = await fetch(`${baseUrl}/users`, {
      headers: { Cookie: identityCookie }
    });
    const listJson = await listRes.json();
    assert.equal(listJson.data[0].name, 'Sandbox User');
  });

  test('DELETE /session/reset purges sandbox overlay records and restores global baseline', async () => {
    const resetRes = await fetch(`${baseUrl}/session/reset`, {
      method: 'DELETE',
      headers: { Cookie: identityCookie }
    });
    assert.equal(resetRes.status, 200);
    const resetJson = await resetRes.json();
    assert.equal(resetJson.message, 'Session sandbox reset successfully');
    assert.ok(typeof resetJson.purgedRecords === 'number');

    // Verify GET /users no longer contains local- record
    const listRes = await fetch(`${baseUrl}/users`, {
      headers: { Cookie: identityCookie }
    });
    const listJson = await listRes.json();
    assert.notEqual(listJson.data[0].name, 'Sandbox User');
  });

  test('POST /session/reset alias works identically', async () => {
    // Create record first
    await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: identityCookie
      },
      body: JSON.stringify({ title: 'Test Post', body: 'Test Content', user_id: 1 })
    });

    const resetRes = await fetch(`${baseUrl}/session/reset`, {
      method: 'POST',
      headers: { Cookie: identityCookie }
    });
    assert.equal(resetRes.status, 200);
    const resetJson = await resetRes.json();
    assert.equal(resetJson.message, 'Session sandbox reset successfully');
  });

  test('X-Playground-Identity header allows resetting session programmatically', async () => {
    const customHeaderIdentity = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

    // Create record using header
    await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': customHeaderIdentity
      },
      body: JSON.stringify({ title: 'Header Todo', user_id: 1, completed: false })
    });

    // Reset using header
    const resetRes = await fetch(`${baseUrl}/session/reset`, {
      method: 'DELETE',
      headers: {
        'X-Playground-Identity': customHeaderIdentity
      }
    });

    assert.equal(resetRes.status, 200);
    const resetJson = await resetRes.json();
    assert.equal(resetJson.message, 'Session sandbox reset successfully');
    assert.ok(resetJson.purgedRecords >= 1);
  });
});
