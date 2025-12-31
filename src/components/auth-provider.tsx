import { auth } from '@/lib/auth/auth-instance';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

async function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }

  return <div>{children}</div>;
}

export default AuthProvider;
