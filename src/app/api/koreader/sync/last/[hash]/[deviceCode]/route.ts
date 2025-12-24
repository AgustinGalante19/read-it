import { turso } from '@/services/database/turso';
import type { NextRequest } from 'next/server';
import { validateDeviceCode } from '@/lib/validateDevice';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/koreader/sync/last/[hash]/[deviceCode]'>
) {
  const { hash, deviceCode } = await ctx.params;

  const validation = await validateDeviceCode(deviceCode);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 401 });
  }

  const { rows } = await turso.execute({
    sql: `SELECT book_last_open 
          FROM readit_books
          WHERE book_hash = ? 
          AND user_email = (
            SELECT user_email 
            FROM readit_user_devices 
            WHERE device_code = ?)
          `,
    args: [hash, deviceCode],
  });

  return Response.json({ last_open: rows[0]?.book_last_open || null });
}
