'use server';

import { auth } from '@/lib/auth/auth-instance';
import { headers } from 'next/headers';

export async function getUserEmail() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.email as string;
}

export async function isAuthenticated(userEmail: string) {
  if (!userEmail) {
    return { success: false, error: 'User not authenticated' };
  }
}
