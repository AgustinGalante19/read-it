import { Book, BookStatus } from '@/types/Book';
import BookAdapter from '../adapters/BookAdapter';
import datesHelper from '../helpers/DatesHelper';
import { db } from '../database/kysely';
import { sql } from 'kysely';
import { uploadBookThumbnail } from '../StorageService';

class BookRepository {
  async findBooksByStatus(
    userEmail: string,
    status: BookStatus,
  ): Promise<Book[]> {
    const query = db
      .selectFrom('readit_books')
      .selectAll()
      .where('user_email', '=', userEmail);

    let result;

    if (status >= 1 && status <= 3) {
      if (status === 1) {
        result = await query
          .orderBy('finish_date', 'desc')
          .where('id_book_status', '=', status)
          .execute();
      } else {
        result = await query
          .orderBy('inserted_at', 'desc')
          .where('id_book_status', '=', status)
          .execute();
      }
    } else {
      result = await query.orderBy('inserted_at', 'desc').execute();
    }

    return BookAdapter(result);
  }

  async getBooksFinishedInMonth(
    userEmail: string,
    month: number,
    year: number,
  ): Promise<Book[]> {
    const monthStr = month.toString().padStart(2, '0');
    const result = await db
      .selectFrom('readit_books')
      .selectAll()
      .where('user_email', '=', userEmail)
      .where('id_book_status', '=', 3)
      .where('finish_date', 'is not', null)
      .where(sql`strftime('%Y-%m', finish_date)`, '=', `${year}-${monthStr}`)
      .orderBy('finish_date', 'asc')
      .execute();

    return BookAdapter(result);
  }

  async findBookByGoogleId(
    googleId: string,
    userEmail: string,
  ): Promise<Book | null> {
    const result = await db
      .selectFrom('readit_books')
      .selectAll()
      .where('google_id', '=', googleId)
      .where('user_email', '=', userEmail)
      .execute();
    if (!result[0]) return null;

    return BookAdapter(result)[0];
  }

  async createBook(bookData: Book): Promise<void> {
    let thumbnailUrl = bookData.thumbnail_url;

    if (thumbnailUrl?.trim()) {
      try {
        thumbnailUrl = await uploadBookThumbnail(
          bookData.google_id,
          thumbnailUrl,
        );
      } catch {
        thumbnailUrl = bookData.thumbnail_url;
      }
    }

    await db
      .insertInto('readit_books')
      .values({
        google_id: bookData.google_id,
        title: bookData.title,
        thumbnail_url: thumbnailUrl,
        authors: bookData.authors,
        publish_date: bookData.publish_date,
        page_count: bookData.page_count,
        tags: bookData.tags,
        user_email: bookData.user_email,
        id_book_status: 1,
        book_type_id: 1,
      })
      .execute();
  }

  async updateBookStatus(
    googleId: string,
    userEmail: string,
    newStatus: number,
    dates?: { startDate?: string; finishDate?: string },
  ): Promise<void> {
    const query = db
      .updateTable('readit_books')
      .where('google_id', '=', googleId)
      .where('user_email', '=', userEmail)
      .set({
        id_book_status: newStatus,
      });

    if (newStatus === 1) {
      await query
        .set({
          start_date: null,
          finish_date: null,
        })
        .execute();
    } else if (newStatus === 2) {
      await query
        .set({
          start_date: dates?.startDate || datesHelper.getCurrentDateDefault(),
        })
        .execute();
    } else if (newStatus === 3) {
      const finish_date =
        dates?.finishDate || datesHelper.getCurrentDateDefault();

      if (dates?.startDate) {
        await query
          .set({
            start_date: dates.startDate,
            finish_date,
          })
          .execute();
      } else {
        await query.set({ finish_date }).execute();
      }
    }
  }

  async updateBookDates(
    googleId: string,
    userEmail: string,
    start_date: string | null,
    finish_date: string | null,
  ): Promise<void> {
    await db
      .updateTable('readit_books')
      .set({
        start_date,
        finish_date,
      })
      .where('google_id', '=', googleId)
      .where('user_email', '=', userEmail)
      .execute();
  }

  async deleteBook(googleId: string, userEmail: string): Promise<void> {
    await db
      .deleteFrom('readit_books')
      .where('google_id', '=', googleId)
      .where('user_email', '=', userEmail)
      .execute();
  }

  async updateHash(
    googleId: string,
    hash: string,
    pageCount: number,
    deviceCode: string,
  ): Promise<void> {
    await db
      .updateTable('readit_books')
      .set({
        book_hash: hash,
        page_count: pageCount,
      })
      .where('google_id', '=', googleId)
      .where('user_email', '=', (eb) =>
        eb
          .selectFrom('readit_user_devices')
          .select('user_email')
          .where('device_code', '=', deviceCode),
      )
      .execute();
  }

  async recordLastReadingInfo({
    totalReadPages,
    totalReadTime,
    lastOpen,
    hash,
    deviceCode,
  }: {
    totalReadPages: number;
    totalReadTime: number;
    lastOpen: string;
    hash: string;
    deviceCode: string;
  }): Promise<void> {
    await db
      .updateTable('readit_books')
      .set({
        book_total_read_pages: totalReadPages,
        book_total_read_time: totalReadTime,
        book_last_open: lastOpen,
      })
      .where('book_hash', '=', hash)
      .where('user_email', '=', (eb) =>
        eb
          .selectFrom('readit_user_devices')
          .select('user_email')
          .where('device_code', '=', deviceCode),
      )
      .execute();
  }

  async updateBookType(
    book_type_id: number,
    googleId: string,
    userEmail: string,
  ): Promise<void> {
    await db
      .updateTable('readit_books')
      .set({ book_type_id })
      .where('google_id', '=', googleId)
      .where('user_email', '=', userEmail)
      .execute();
  }
}

const bookRepository = new BookRepository();

export default bookRepository;
