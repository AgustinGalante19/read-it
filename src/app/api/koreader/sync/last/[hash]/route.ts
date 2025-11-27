import { turso } from '@/services/database/turso';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/koreader/sync/last/[hash]'>
) {
  const { hash } = await ctx.params;
  const { rows } = await turso.execute({
    sql: `SELECT book_last_open 
          FROM readit_books
          WHERE book_hash = ?`,
    args: [hash],
  });

  return Response.json({ last_open: rows[0]?.book_last_open || null });
}
