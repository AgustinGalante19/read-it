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
    inserted_at: new Date(),
    is_readed: false,
    page_count: pageCount,
    publish_date: getDateString(publishedDate),
    thumbnail_url: imageLinks?.thumbnail,
    title,
    readed_at: new Date(),
    tags: '',
  };
}

export function mapBooksArray(googleBook: GoogleBookItem[]): Book[] {
  if (!googleBook) return [];
  return googleBook.map((book) => mapBookObject(book));
}
