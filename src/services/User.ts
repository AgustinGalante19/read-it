'use server';

import { getServerSession } from 'next-auth';

export async function getUserEmail() {
  const session = await getServerSession();

  return session?.user?.email as string;
}
