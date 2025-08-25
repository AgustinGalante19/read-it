import { Book, GoogleBookItem } from '@/types/Book';
import getAuthorsString from './getAuthorsString';
import { getDateString } from './date-utils';

export default function mapBookObject(googleBook: GoogleBookItem): Book {
  const { authors, pageCount, publishedDate, imageLinks, title } =
    googleBook.volumeInfo;

  return {
    authors: getAuthorsString(authors),
    google_id: googleBook.id,
    id: 0,
    inserted_at: '',
    finish_date: '',
    id_book_status: 0,
    start_date: '',
    user_email: '',
    page_count: pageCount,
    publish_date: getDateString(publishedDate),
    thumbnail_url: imageLinks?.thumbnail,
    title,
    tags: '',
  };
}

export function mapBooksArray(googleBook: GoogleBookItem[]): Book[] {
  if (!googleBook) return [];
  return googleBook.map((book) => mapBookObject(book));
}
