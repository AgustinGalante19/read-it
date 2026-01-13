import { Book, ExtendedBookData, GoogleBookItem } from '@/types/Book';
import { ResultSet } from '@libsql/client/web';
import datesHelper from '../helpers/DatesHelper';
import bookHelper from '../helpers/BookHelper';
import { BookHighlightPreview } from '@/types/BookHighlight';

/**
 * Tipo para representar una fila de la base de datos
 */
type DatabaseRow = Record<string, unknown>;

/**
 * Función base para mapear las propiedades comunes de un libro desde la base de datos
 */
function mapBaseBookProperties(book: DatabaseRow): Book {
  return {
    id: Number(book.id),
    google_id: String(book.google_id),
    title: String(book.title),
    thumbnail_url: String(book.thumbnail_url),
    authors: String(book.authors),
    publish_date: String(book.publish_date),
    page_count: Number(book.page_count),
    inserted_at: String(book.inserted_at),
    start_date:
      String(book.start_date) === 'null' ? null : String(book.start_date),
    finish_date:
      String(book.finish_date) === 'null' ? null : String(book.finish_date),
    tags: String(book.tags),
    user_email: String(book.user_email),
    id_book_status: Number(book.id_book_status),
    book_hash: book.book_hash ? String(book.book_hash) : null,
    book_last_open: book.book_last_open ? String(book.book_last_open) : null,
    book_total_read_time: book.book_total_read_time
      ? Number(book.book_total_read_time)
      : null,
    book_total_read_pages: book.book_total_read_pages
      ? Number(book.book_total_read_pages)
      : null,
    book_type_id: Number(book.book_type_id),
  };
}

/**
 * Adapter estándar para libros sin propiedades adicionales
 */
export default function BookAdapter(dbResponse: ResultSet): Book[] {
  return dbResponse.rows.map(mapBaseBookProperties);
}

export function mapGoogleBookToBook(
  googleBook: GoogleBookItem
): ExtendedBookData {
  const { authors, pageCount, publishedDate, imageLinks, title } =
    googleBook.volumeInfo;

  return {
    authors: bookHelper.getBookAuthors(authors),
    google_id: googleBook.id,
    id: 0,
    inserted_at: '',
    finish_date: '',
    id_book_status: 0,
    start_date: '',
    user_email: '',
    page_count: pageCount,
    publish_date: datesHelper.getDateString(publishedDate),
    thumbnail_url: imageLinks?.thumbnail,
    title,
    tags: googleBook.volumeInfo.categories
      ? googleBook.volumeInfo.categories.join('/')
      : '',
    description: googleBook.volumeInfo.description,
    book_type_id: 0,
  };
}

export function mapGoogleBooksArray(googleBook: GoogleBookItem[]): Book[] {
  if (!googleBook) return [];
  return googleBook.map((book) => mapGoogleBookToBook(book));
}

export function highlightAdapter(
  dbResponse: ResultSet
): BookHighlightPreview[] {
  return dbResponse.rows.map((row) => ({
    highlight_id: Number(row.highlight_id),
    book_id: Number(row.book_id),
    title: String(row.title),
    author: String(row.authors),
    page: Number(row.page),
    created_at: String(row.created_at),
    highlight_text: String(row.highlight_text),
  }));
}
