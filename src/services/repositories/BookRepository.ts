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
        query = `SELECT * FROM readit_books WHERE id_book_status = 3 AND user_email = ? ORDER BY inserted_at DESC`;
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

  async createBook(bookData: {
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
}

const bookRepository = new BookRepository();

export default bookRepository;
