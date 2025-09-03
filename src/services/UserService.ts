'use server';

import { getServerSession } from 'next-auth';

export async function getUserEmail() {
  const session = await getServerSession();

  return session?.user?.email as string;
}

export async function isAuthenticated(userEmail: string) {
  if (!userEmail) {
    return { success: false, error: 'User not authenticated' };
  }
}
