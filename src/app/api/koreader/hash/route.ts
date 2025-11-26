import { updateBookHash } from '@/services/BookService';

export async function POST(request: Request) {
  const body = await request.json();
  const { hash, googleId } = body;
  await updateBookHash(hash, googleId);
  return new Response('Hash updated successfully');
}
