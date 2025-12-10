import { Book, BookStatus } from '@/types/Book';
import { turso } from '../database/turso';
import BookAdapter, { BookAdapterWithStatus } from '../adapters/BookAdapter';
import datesHelper from '../helpers/DatesHelper';

class BookRepository {
  async findBooksByStatus(
    userEmail: string,
    status: BookStatus
  ): Promise<Book[]> {
    let query: string;

    switch (status) {
      case BookStatus.READ:
        query = `SELECT * FROM readit_books WHERE id_book_status = 3 AND user_email = ? ORDER BY finish_date DESC`;
        break;
      case BookStatus.READING:
        query = `SELECT * FROM readit_books WHERE id_book_status = 2 AND user_email = ? ORDER BY inserted_at DESC`;
        break;
      case BookStatus.WANT_TO_READ:
        query = `SELECT * FROM readit_books WHERE id_book_status = 1 AND user_email = ? ORDER BY inserted_at DESC`;
        break;
      default:
        query = `SELECT * FROM readit_books WHERE user_email = ? ORDER BY inserted_at DESC`;
    }

    const result = await turso.execute({
      sql: query,
      args: [userEmail],
    });

    return BookAdapter(result);
  }

  async getBooksFinishedInMonth(
    userEmail: string,
    month: number,
    year: number
  ): Promise<Book[]> {
    const monthStr = month.toString().padStart(2, '0');
    // Filter by finish_date in format 'YYYY-MM-DD' or 'YYYY-MM-DDT...'
    // SQLite strftime('%Y-%m', finish_date) matches 'YYYY-MM'
    const query = `
      SELECT * FROM readit_books 
      WHERE user_email = ? 
      AND id_book_status = 3 
      AND finish_date IS NOT NULL
      AND strftime('%Y-%m', finish_date) = ?
      ORDER BY finish_date ASC
    `;

    const result = await turso.execute({
      sql: query,
      args: [userEmail, `${year}-${monthStr}`],
    });

    return BookAdapter(result);
  }

  async findBookByGoogleId(
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
    return BookAdapterWithStatus(result)[0];
  }

  async createBook(bookData: Book): Promise<void> {
    await turso.execute({
      sql: `INSERT INTO readit_books (google_id, title, thumbnail_url, authors, publish_date, page_count, tags, user_email, id_book_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        bookData.google_id,
        bookData.title,
        bookData.thumbnail_url,
        bookData.authors,
        bookData.publish_date,
        bookData.page_count,
        bookData.tags,
        bookData.user_email,
        1, // Default status: not read
      ],
    });
  }

  async updateBookStatus(
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
      const startDate = dates?.startDate || datesHelper.getCurrentDateDefault();
      await turso.execute({
        sql: `UPDATE readit_books SET id_book_status = ?, start_date = ? WHERE google_id = ? AND user_email = ?`,
        args: [newStatus, startDate, googleId, userEmail],
      });
    } else if (newStatus === 3) {
      const finishDate =
        dates?.finishDate || datesHelper.getCurrentDateDefault();
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

  async updateBookDates(
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

  async deleteBook(googleId: string, userEmail: string): Promise<void> {
    await turso.execute({
      sql: `DELETE FROM readit_books WHERE google_id = ? AND user_email = ?`,
      args: [googleId, userEmail],
    });
  }

  async updateHash(
    googleId: string,
    hash: string,
    pageCount: number
  ): Promise<void> {
    await turso.execute({
      sql: `
      UPDATE readit_books 
      SET book_hash = ?,
          page_count = ? 
      WHERE google_id = ? AND user_email = ?`,
      args: [hash, pageCount, googleId, 'agustin.19.galante@gmail.com'],
    });
  }

  async recordLastReadingInfo({
    totalReadPages,
    totalReadTime,
    lastOpen,
    hash,
  }: {
    totalReadPages: number;
    totalReadTime: number;
    lastOpen: string;
    hash: string;
  }): Promise<void> {
    await turso.execute({
      sql: `UPDATE readit_books 
            SET book_total_read_pages = ?,
                book_total_read_time =  ?,
                book_last_open = ?
            WHERE book_hash = ?`,
      args: [totalReadPages, totalReadTime, lastOpen, hash],
    });
  }
}

const bookRepository = new BookRepository();

export default bookRepository;
