import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { createSignedToken, verifySignedToken } from '../src/utils/sessionToken.js';

describe('Option B Signed Session Architecture & Reset API (/session/reset)', () => {
  let server;
  let baseUrl;
  let identityCookie = '';
  let responseSignedToken = '';

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

  test('createSignedToken and verifySignedToken correctly sign and verify UUIDs', () => {
    const testUuid = '11111111-2222-3333-4444-555555555555';
    const signedToken = createSignedToken(testUuid);
    assert.ok(signedToken.includes('.'));

    const verified = verifySignedToken(signedToken);
    assert.equal(verified, testUuid);

    const tamperedToken = `${testUuid}.invalid_signature_hash_12345`;
    const tamperedResult = verifySignedToken(tamperedToken);
    assert.equal(tamperedResult, null);
  });

  test('POST /users creates local sandbox record and returns X-Playground-Identity header', async () => {
    const getRes = await fetch(`${baseUrl}/users`);
    const setCookie = getRes.headers.get('set-cookie');
    responseSignedToken = getRes.headers.get('x-playground-identity');
    assert.ok(responseSignedToken, 'Expected X-Playground-Identity header in response');

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

  test('IP Auto-Recovery attaches request without cookie to existing IP session', async () => {
    // Request without sending any Cookie header
    const noCookieRes = await fetch(`${baseUrl}/users`);
    assert.equal(noCookieRes.status, 200);
    const json = await noCookieRes.json();
    // Since previous test created a user for this IP, IP auto-recovery attached to the existing session!
    assert.ok(json.data.some(u => u.name === 'Sandbox User'), 'Expected Sandbox User to be present via IP auto-recovery');
  });

  test('Tampered token is rejected and safely falls back to IP session', async () => {
    const tamperedCookie = 'pg_identity=99999999-9999-9999-9999-999999999999.forged_signature_abc';
    const res = await fetch(`${baseUrl}/users`, {
      headers: { Cookie: tamperedCookie }
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    // Tampered cookie was ignored, IP auto-recovery safely returned existing IP session data
    assert.ok(json.data.some(u => u.name === 'Sandbox User'), 'Expected Sandbox User to be present after tampered token rejection');
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

  test('X-Playground-Identity header token allows resetting session programmatically', async () => {
    const testUuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    const signedHeaderToken = createSignedToken(testUuid);

    // Create record using signed header
    await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Playground-Identity': signedHeaderToken
      },
      body: JSON.stringify({ title: 'Header Todo', user_id: 1, completed: false })
    });

    // Reset using header
    const resetRes = await fetch(`${baseUrl}/session/reset`, {
      method: 'DELETE',
      headers: {
        'X-Playground-Identity': signedHeaderToken
      }
    });

    assert.equal(resetRes.status, 200);
    const resetJson = await resetRes.json();
    assert.equal(resetJson.message, 'Session sandbox reset successfully');
    assert.ok(resetJson.purgedRecords >= 1);
  });
});
