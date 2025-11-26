import { turso } from '@/services/database/turso';
import { BookStatus } from '@/types/Book';

export async function GET() {
  const { rows } = await turso.execute({
    sql: `SELECT id, google_id as googleId, CONCAT(title,' - ' ,authors) as bookInfo 
          FROM readit_books 
          WHERE user_email = ? 
          AND (id_book_status = ? OR id_book_status = ?)`,
    args: [
      'agustin.19.galante@gmail.com',
      BookStatus.READING,
      BookStatus.WANT_TO_READ,
    ],
  });
  return Response.json(rows);
}
