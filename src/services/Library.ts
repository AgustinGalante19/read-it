'use server';

import { getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import { Book, GoogleBookItem } from '@/types/Book';
import { QueryResult, sql } from '@vercel/postgres';

interface Response<T> {
  status: boolean;
  result: T;
}

export async function addBook(book: GoogleBookItem): Promise<Response<string>> {
  try {
    const { title, pageCount, publishedDate, authors, imageLinks } =
      book.volumeInfo;

    const exists =
      await sql`SELECT id FROM public.books WHERE google_id = ${book.id}`;

    if (exists.rowCount && exists.rowCount > 0) {
      return { status: false, result: `This book is already in the library` };
    }
    await sql`INSERT INTO public.books(google_id, title, thumbnail_url, authors, publish_date, is_readed, page_count)
	VALUES (${book.id}, ${title}, ${
      imageLinks?.thumbnail || '/thumbnail-fallback.jpg'
    }, ${getAuthorsString(authors)}, ${getDateString(
      publishedDate
    )}, false, ${pageCount});`;

    return { status: true, result: 'Book added successfully' };
  } catch (err) {
    console.log(err);
    return { status: false, result: 'Something went wrong' };
  }
}

export async function getReadList(isReaded = false): Promise<Response<Book[]>> {
  const books: QueryResult<Book> =
    await sql`SELECT * FROM public.books WHERE is_readed = ${isReaded}`;

  return { result: books.rows, status: true };
}
