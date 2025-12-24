import { updateBookHash } from '@/services/BookService';
import { validateDeviceCode } from '@/lib/validateDevice';

export async function POST(request: Request) {
  const body = await request.json();
  const { hash, googleId, pageCount, deviceCode } = body;

  const validation = await validateDeviceCode(deviceCode);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 401 });
  }

  await updateBookHash(hash, googleId, pageCount, deviceCode);
  return new Response('Hash updated successfully');
}
