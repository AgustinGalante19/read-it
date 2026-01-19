import { BookStatus } from '@/types/Book';
import { NextRequest } from 'next/server';
import { validateDeviceCode } from '@/lib/validateDevice';
import { db } from '@/services/database/kysely';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/koreader/books/[deviceCode]'>,
) {
  const { deviceCode } = await ctx.params;

  const validation = await validateDeviceCode(deviceCode);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 401 });
  }

  const result = await db
    .selectFrom('readit_books as rb')
    .fullJoin('readit_user_devices as rud', 'rb.user_email', 'rud.user_email')
    .select(({ fn, val }) => [
      'rb.id',
      'rb.google_id',
      fn<string>('concat', ['rb.title', val(' - '), 'rb.authors']).as(
        'bookInfo',
      ),
    ])
    .where('rud.device_code', '=', deviceCode)
    .where((eb) =>
      eb.or([
        eb('rb.id_book_status', '=', BookStatus.READING),
        eb('rb.id_book_status', '=', BookStatus.WANT_TO_READ),
      ]),
    )
    .execute();

  return Response.json(result);
}
