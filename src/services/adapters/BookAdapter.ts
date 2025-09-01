import { Book } from '@/types/Book';
import { ResultSet } from '@libsql/client/web';

export default function BookAdapter(dbResponse: ResultSet): Book[] {
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
