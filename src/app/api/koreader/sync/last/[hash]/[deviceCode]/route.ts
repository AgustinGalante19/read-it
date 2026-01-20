import type { NextRequest } from 'next/server';
import { validateDeviceCode } from '@/lib/validateDevice';
import { db } from '@/services/database/kysely';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/koreader/sync/last/[hash]/[deviceCode]'>
) {
  const { hash, deviceCode } = await ctx.params;

  const validation = await validateDeviceCode(deviceCode);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 401 });
  }

  const result = await db
    .selectFrom('readit_books')
    .select('book_last_open')
    .where('book_hash', '=', hash)
    .where('user_email', '=', (eb) =>
      eb
        .selectFrom('readit_user_devices')
        .select('user_email')
        .where('device_code', '=', deviceCode)
    )
    .executeTakeFirst();

  return Response.json({ last_open: result?.book_last_open || null });
}
