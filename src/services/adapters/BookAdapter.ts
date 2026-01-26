import { Book, ExtendedBookData, GoogleBookItem } from '@/types/Book';
import datesHelper from '../helpers/DatesHelper';
import bookHelper from '../helpers/BookHelper';
import {
  BookHighlightPreview,
  BookHighlightWithBook,
} from '@/types/BookHighlight';
import {
  BookHighlightRow,
  BookHighlightWithBookRow,
  BookRow,
} from '@/types/ReadItDatabase';

function mapBaseBookProperties(book: BookRow): Book {
  return {
    id: book.id ?? 0,
    google_id: book.google_id,
    title: book.title,
    thumbnail_url: book.thumbnail_url ?? '',
    authors: book.authors ?? '',
    publish_date: book.publish_date ?? '',
    page_count: book.page_count ?? 0,
    inserted_at: book.inserted_at,
    start_date: book.start_date ?? null,
    finish_date: book.finish_date ?? null,
    tags: book.tags ?? '',
    user_email: book.user_email ?? '',
    id_book_status: book.id_book_status ?? 1,
    book_hash: book.book_hash ?? null,
    book_last_open: book.book_last_open ?? null,
    book_total_read_time: book.book_total_read_time ?? null,
    book_total_read_pages: book.book_total_read_pages ?? null,
    book_type_id: book.book_type_id ?? 1,
  };
}

/**
 * Adapter estándar para libros desde Kysely
 */
export default function BookAdapter(dbResponse: BookRow[]): Book[] {
  return dbResponse.map(mapBaseBookProperties);
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
  dbResponse: BookHighlightRow[]
): BookHighlightPreview[] {
  return dbResponse.map((row) => ({
    highlight_id: Number(row.highlight_id),
    book_id: Number(row.book_id),
    title: String(row.title),
    author: String(row.authors ?? ''),
    page: Number(row.page),
    created_at: String(row.created_at),
    highlight_text: String(row.highlight_text),
  }));
}

export function highlightWithBookAdapter(
  dbResponse: BookHighlightWithBookRow[]
): BookHighlightWithBook[] {
  return dbResponse.map((row) => ({
    highlight_id: Number(row.highlight_id),
    book_id: Number(row.book_id),
    title: String(row.title),
    author: String(row.authors ?? ''),
    page: Number(row.page),
    created_at: String(row.created_at),
    highlight_text: String(row.highlight_text),
    google_id: String(row.google_id),
    thumbnail_url: row.thumbnail_url ?? null,
  }));
}
