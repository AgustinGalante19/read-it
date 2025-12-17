import { updateBookHash } from '@/services/BookService';

export async function POST(request: Request) {
  const body = await request.json();
  const { hash, googleId, pageCount, deviceCode } = body;
  await updateBookHash(hash, googleId, pageCount, deviceCode);
  return new Response('Hash updated successfully');
}
