import { turso } from '@/services/database/turso';
import { BookStatus } from '@/types/Book';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/koreader/books/[deviceCode]'>
) {
  const { deviceCode } = await ctx.params;
  console.log({ deviceCode });
  const { rows } = await turso.execute({
    sql: `
          SELECT b.id, b.google_id as googleId, CONCAT(b.title,' - ', b.authors) as bookInfo 
          FROM readit_books b
          INNER JOIN readit_user_devices d ON b.user_email = d.user_email
          WHERE d.device_code = ? 
          AND (b.id_book_status = ? OR b.id_book_status = ?)
          `,
    args: [deviceCode, BookStatus.READING, BookStatus.WANT_TO_READ],
  });
  return Response.json(rows);
}
