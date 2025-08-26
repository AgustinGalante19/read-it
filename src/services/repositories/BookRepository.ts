import { turso } from '../turso';
import { ResultSet } from '@libsql/client/web';
import { Book, BookStatus } from '@/types/Book';

function mapDbResultToBook(dbResponse: ResultSet): Book[] {
  return dbResponse.rows.map((book) => ({
    id: Number(book.id),
    google_id: String(book.google_id),
    title: String(book.title),
    thumbnail_url: String(book.thumbnail_url),
    authors: String(book.authors),
    publish_date: String(book.publish_date),
    page_count: Number(book.page_count),
    inserted_at: String(book.inserted_at),
    start_date: String(book.start_date),
    finish_date: String(book.finish_date),
    tags: String(book.tags),
    user_email: String(book.user_email),
    id_book_status: Number(book.id_book_status),
  }));
}

export async function findBooksByStatus(
  userEmail: string,
  status: BookStatus
): Promise<Book[]> {
  let query: string;

  switch (status) {
    case 'readed':
      query = `SELECT * FROM readit_books WHERE id_book_status = 3 AND user_email = ? ORDER BY inserted_at DESC`;
      break;
    case 'reading':
      query = `SELECT * FROM readit_books WHERE id_book_status = 2 AND user_email = ? ORDER BY inserted_at DESC`;
      break;
    case 'wantTo':
      query = `SELECT * FROM readit_books WHERE id_book_status = 1 AND user_email = ? ORDER BY inserted_at DESC`;
      break;
    default:
      query = `SELECT * FROM readit_books WHERE user_email = ? ORDER BY inserted_at DESC`;
  }

  const result = await turso.execute({
    sql: query,
    args: [userEmail],
  });

  return mapDbResultToBook(result);
}

export async function findBookByGoogleId(
  googleId: string,
  userEmail: string
): Promise<(Book & { ds_status: string }) | null> {
  const result = await turso.execute({
    sql: `SELECT b.*, bs.ds_status  
          FROM readit_books b 
          JOIN readit_book_status bs ON b.id_book_status = bs.id  
          WHERE google_id = ? 
          AND user_email = ?;`,
    args: [googleId, userEmail],
  });

  if (result.rows.length === 0) return null;

  const book = result.rows[0];
  return {
    id: Number(book.id),
    google_id: String(book.google_id),
    title: String(book.title),
    thumbnail_url: String(book.thumbnail_url),
    authors: String(book.authors),
    publish_date: String(book.publish_date),
    page_count: Number(book.page_count),
    inserted_at: String(book.inserted_at),
    start_date: String(book.start_date),
    finish_date: String(book.finish_date),
    tags: String(book.tags),
    user_email: String(book.user_email),
    id_book_status: Number(book.id_book_status),
    ds_status: String(book.ds_status),
  };
}

export async function createBook(bookData: {
  googleId: string;
  title: string;
  thumbnailUrl: string;
  authors: string;
  publishDate: string;
  pageCount: number;
  tags: string;
  userEmail: string;
}): Promise<void> {
  await turso.execute({
    sql: `INSERT INTO readit_books (google_id, title, thumbnail_url, authors, publish_date, page_count, tags, user_email, id_book_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      bookData.googleId,
      bookData.title,
      bookData.thumbnailUrl,
      bookData.authors,
      bookData.publishDate,
      bookData.pageCount,
      bookData.tags,
      bookData.userEmail,
      1, // Default status: not read
    ],
  });
}

export async function updateBookStatus(
  googleId: string,
  userEmail: string,
  newStatus: number,
  dates?: { startDate?: string; finishDate?: string }
): Promise<void> {
  if (newStatus === 1) {
    await turso.execute({
      sql: `UPDATE readit_books SET id_book_status = ?, start_date = NULL, finish_date = NULL WHERE google_id = ? AND user_email = ?`,
      args: [newStatus, googleId, userEmail],
    });
  } else if (newStatus === 2) {
    const startDate =
      dates?.startDate || new Date().toISOString().split('T')[0];
    await turso.execute({
      sql: `UPDATE readit_books SET id_book_status = ?, start_date = ? WHERE google_id = ? AND user_email = ?`,
      args: [newStatus, startDate, googleId, userEmail],
    });
  } else if (newStatus === 3) {
    const finishDate =
      dates?.finishDate || new Date().toISOString().split('T')[0];
    if (dates?.startDate) {
      await turso.execute({
        sql: `UPDATE readit_books SET id_book_status = ?, start_date = ?, finish_date = ? WHERE google_id = ? AND user_email = ?`,
        args: [newStatus, dates.startDate, finishDate, googleId, userEmail],
      });
    } else {
      await turso.execute({
        sql: `UPDATE readit_books SET id_book_status = ?, finish_date = ? WHERE google_id = ? AND user_email = ?`,
        args: [newStatus, finishDate, googleId, userEmail],
      });
    }
  }
}

export async function updateBookDates(
  googleId: string,
  userEmail: string,
  startDate: string | null,
  finishDate: string | null
): Promise<void> {
  await turso.execute({
    sql: `UPDATE readit_books SET start_date = ?, finish_date = ? WHERE google_id = ? AND user_email = ?`,
    args: [startDate, finishDate, googleId, userEmail],
  });
}

export async function deleteBook(
  googleId: string,
  userEmail: string
): Promise<void> {
  await turso.execute({
    sql: `DELETE FROM readit_books WHERE google_id = ? AND user_email = ?`,
    args: [googleId, userEmail],
  });
}

export async function findBooksByDateRange(
  userEmail: string,
  fromDate: Date,
  toDate: Date,
  status = 3
): Promise<Book[]> {
  const result = await turso.execute({
    sql: `SELECT * 
          FROM readit_books 
          WHERE user_email = ?
          AND id_book_status = ?
          AND finish_date BETWEEN ? AND ?
          ORDER BY finish_date DESC`,
    args: [userEmail, status, fromDate.toISOString(), toDate.toISOString()],
  });

  return mapDbResultToBook(result);
}

export async function getTotalPageCount(
  userEmail: string,
  status = 3
): Promise<number> {
  const { rows } = await turso.execute({
    sql: `SELECT SUM(page_count) as total_pages FROM readit_books WHERE user_email = ? AND id_book_status = ?`,
    args: [userEmail, status],
  });

  return Number(rows[0]?.total_pages) || 0;
}

export async function getBookTags(
  userEmail: string,
  status = 3
): Promise<string[]> {
  const { rows } = await turso.execute({
    sql: `SELECT tags FROM readit_books WHERE id_book_status = ? AND user_email = ?`,
    args: [status, userEmail],
  });

  return rows.map((row) => String(row.tags));
}
