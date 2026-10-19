import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth/auth-instance';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
    // Refresh through /api/auth/get-session, where Set-Cookie reaches the browser.
    query: { disableRefresh: true },
  });

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/calendar', '/library', '/stats', '/search'],
};
