import { updateBookHash } from '@/services/BookService';

export async function POST(request: Request) {
  const body = await request.json();
  const { hash, googleId, pageCount } = body;
  await updateBookHash(hash, googleId, pageCount);
  return new Response('Hash updated successfully');
}
