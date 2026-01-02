'use server';

import { auth } from '@/lib/auth/auth-instance';
import { headers } from 'next/headers';
import userRepository from './repositories/UserRepository';

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

export async function checkIfUserExists(email: string) {
  return await userRepository.checkIfUserExists(email);
}

export async function createUser(name: string, email: string) {
  await userRepository.createUser(name, email);
}
