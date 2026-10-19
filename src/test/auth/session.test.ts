// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHmac } from 'node:crypto';
import { NextRequest } from 'next/server';

const { requestContext } = vi.hoisted(() => {
  vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3000');
  vi.stubEnv('BETTER_AUTH_SECRET', 'test-only-secret-for-auth-integration-tests-123456789');
  vi.stubEnv('AUTH_GOOGLE_ID', 'test-google-client');
  vi.stubEnv('AUTH_GOOGLE_SECRET', 'test-google-secret');
  return { requestContext: { headers: new Headers(), closeDatabase: () => {} } };
});

vi.mock('@/services/database/kysely', async () => {
  const { readFileSync } = await import('node:fs');
  const { Kysely } = await import('kysely');
  const { LibsqlDialect, libsql } = await import('@libsql/kysely-libsql');
  const client = libsql.createClient({ url: 'file::memory:' });
  await client.executeMultiple(readFileSync('scripts/tables.sql', 'utf8'));
  requestContext.closeDatabase = () => client.close();
  return {
    db: new Kysely({ dialect: new LibsqlDialect({ client }) }),
  };
});

vi.mock('next/headers', () => ({
  headers: async () => requestContext.headers,
  cookies: async () => ({
    set: () => {
      throw new Error('Cookies cannot be written during server rendering');
    },
  }),
}));

import { auth } from '@/lib/auth/auth-instance';
import { db } from '@/services/database/kysely';
import { getUserEmail } from '@/services/UserService';
import { proxy } from '@/proxy';
import { GET, POST } from '@/app/api/auth/[...all]/route';

const day = 24 * 60 * 60 * 1000;
let token: string;
let originalExpiry: Date;

async function getSessionResponse() {
  return GET(new Request('http://localhost:3000/api/auth/get-session', {
    headers: requestContext.headers,
  }));
}

describe('Google sign-in and persistent sessions', () => {
  beforeEach(async () => {
    await db.deleteFrom('session').execute();
    await db.deleteFrom('user').execute();
    const context = await auth.$context;
    const user = await context.internalAdapter.createUser({
      name: 'Reader',
      email: 'reader@example.com',
      emailVerified: true,
    });
    const session = await context.internalAdapter.createSession(user.id);
    token = session.token;
    originalExpiry = session.expiresAt;
    const signature = createHmac('sha256', context.secret).update(token).digest('base64');
    requestContext.headers = new Headers({
      cookie: `${context.authCookies.sessionToken.name}=${encodeURIComponent(`${token}.${signature}`)}`,
    });
  });

  afterAll(async () => {
    await db.destroy();
    requestContext.closeDatabase();
    vi.unstubAllEnvs();
  });

  it('requests only identity scopes, without forced consent or offline access', async () => {
    const response = await POST(new Request('http://localhost:3000/api/auth/sign-in/social', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ provider: 'google', callbackURL: '/' }),
    }));
    expect(response.status).toBe(200);
    const { url } = await response.json();
    const params = new URL(url).searchParams;
    expect(params.get('prompt')).toBe('select_account');
    expect(params.get('access_type')).toBe('online');
    expect(params.get('scope')?.split(' ').sort()).toEqual(['email', 'openid', 'profile']);
  });

  it('creates a session with a persistent 30-day cookie', async () => {
    expect(originalExpiry.getTime() - Date.now()).toBeGreaterThan(30 * day - 5000);
    expect(originalExpiry.getTime() - Date.now()).toBeLessThanOrEqual(30 * day);
    // Make a refresh due, as if this session was created two days ago.
    const oldExpiry = new Date(Date.now() + 28 * day);
    await db.updateTable('session').set({ expiresAt: oldExpiry.toISOString() })
      .where('token', '=', token).execute();

    // Server validation must not consume a renewal without delivering its cookie.
    const response = await proxy(new NextRequest('http://localhost:3000/', {
      headers: requestContext.headers,
    }));
    expect(response.headers.get('location')).toBeNull();
    expect(await getUserEmail()).toBe('reader@example.com');
    const beforeRefresh = await db.selectFrom('session').selectAll()
      .where('token', '=', token).executeTakeFirstOrThrow();
    expect(new Date(beforeRefresh.expiresAt).getTime()).toBe(oldExpiry.getTime());

    // The browser endpoint must extend both the stored session and its cookie.
    const refreshed = await getSessionResponse();
    expect(refreshed.status).toBe(200);
    const cookie = refreshed.headers.get('set-cookie');
    const maxAge = Number(cookie?.match(/Max-Age=(\d+)/)?.[1]);
    expect(maxAge).toBeGreaterThanOrEqual(30 * day / 1000 - 5);
    expect(maxAge).toBeLessThanOrEqual(30 * day / 1000);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    const body = await refreshed.json();
    expect(new Date(body.session.expiresAt).getTime()).toBeGreaterThan(Date.now() + 30 * day - 5000);
    const afterRefresh = await db.selectFrom('session').selectAll()
      .where('token', '=', token).executeTakeFirstOrThrow();
    expect(new Date(afterRefresh.expiresAt).getTime()).toBe(new Date(body.session.expiresAt).getTime());
    // Repeated reads within the daily renewal interval do not renew again.
    const repeated = await getSessionResponse();
    expect(repeated.headers.get('set-cookie')).toBeNull();
  });

  it('rejects an expired session instead of renewing it', async () => {
    await db.updateTable('session').set({ expiresAt: new Date(Date.now() - day).toISOString() })
      .where('token', '=', token).execute();
    const response = await proxy(new NextRequest('http://localhost:3000/', {
      headers: requestContext.headers,
    }));
    expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in');
    expect(await getUserEmail()).toBeUndefined();
    const expired = await getSessionResponse();
    expect(await expired.json()).toBeNull();
  });

  it('redirects unauthenticated requests to sign in', async () => {
    const response = await proxy(new NextRequest('http://localhost:3000/'));
    expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in');
  });
});
