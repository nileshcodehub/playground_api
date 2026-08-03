import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('11 — Fake JWT Auth Simulation (/auth)', () => {
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

  test('POST /auth/login returns JWT access_token, refresh_token, and user', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Bret', password: 'password123' })
    });

    assert.equal(res.status, 200);
    const data = await res.json();

    assert.ok(data.access_token);
    assert.ok(data.refresh_token);
    assert.equal(data.token_type, 'Bearer');
    assert.equal(data.user.username.toLowerCase(), 'bret');
  });

  test('POST /auth/register creates custom user and returns JWT tokens', async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        username: 'sarahc',
        email: 'sarah@skynet.test'
      })
    });

    assert.equal(res.status, 201);
    const data = await res.json();

    assert.ok(data.access_token);
    assert.ok(data.refresh_token);
    assert.equal(data.user.name, 'Sarah Connor');
    assert.equal(data.user.username, 'sarahc');
  });

  test('POST /auth/refresh exchanges refresh token for new access token', async () => {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Bret' })
    });

    const loginData = await loginRes.json();
    const refreshToken = loginData.refresh_token;

    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    assert.equal(refreshRes.status, 200);
    const refreshData = await refreshRes.json();

    assert.ok(refreshData.access_token);
    assert.equal(refreshData.token_type, 'Bearer');
  });

  test('GET /auth/me returns authenticated user profile with Bearer token', async () => {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Bret' })
    });
    const loginData = await loginRes.json();

    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginData.access_token}`
      }
    });

    assert.equal(meRes.status, 200);
    const meData = await meRes.json();

    assert.equal(meData.username.toLowerCase(), 'bret');
  });

  test('PATCH /auth/me updates authenticated user profile in session sandbox', async () => {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Bret' })
    });
    const loginData = await loginRes.json();

    const patchRes = await fetch(`${baseUrl}/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.access_token}`
      },
      body: JSON.stringify({ name: 'Bret - Updated' })
    });

    assert.equal(patchRes.status, 200);
    const patchData = await patchRes.json();
    assert.equal(patchData.name, 'Bret - Updated');

    // Confirm GET /auth/me retains updated name
    const getRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${loginData.access_token}` }
    });
    const getData = await getRes.json();
    assert.equal(getData.name, 'Bret - Updated');
  });

  test('GET /auth/me without token returns 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/auth/me`);
    assert.equal(res.status, 401);
  });
});
