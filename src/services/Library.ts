'use server';

import { getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import { Book, BookStatus, GoogleBookItem } from '@/types/Book';
import { QueryResult, sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

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

    revalidatePath('/book');
    return { status: true, result: 'Book added successfully' };
  } catch (err) {
    console.log(err);
    return { status: false, result: 'Something went wrong' };
  }
}

export async function existsOnLibrary(
  id: string
): Promise<Response<Book | null>> {
  const exists: QueryResult<Book> =
    await sql`SELECT * FROM public.books WHERE google_id = ${id}`;

  if (exists.rows.length > 0) {
    return { status: true, result: exists.rows[0] };
  }
  return { status: false, result: null };
}

export async function updateReadStatus(
  id: string,
  newStatus: boolean
): Promise<Response<string>> {
  await sql`UPDATE public.books SET is_readed = ${newStatus} WHERE google_id = ${id}`;

  revalidatePath('/book');
  revalidatePath('/');
  return { status: true, result: 'Status updated successfully' };
}

export async function removeFromLibrary(
  id: string
): Promise<Response<boolean>> {
  await sql`DELETE FROM public.books WHERE google_id = ${id}`;
  revalidatePath('/book');
  revalidatePath('/');
  return { result: true, status: true };
}

export async function getMyBooks(
  status: BookStatus
): Promise<Response<Book[]>> {
  let books: QueryResult<Book>;

  if (status === 'readed') {
    books = await sql`SELECT * FROM public.books WHERE is_readed = true`;
  } else if (status === 'notReaded') {
    books = await sql`SELECT * FROM public.books WHERE is_readed = false`;
  } else {
    books = await sql`SELECT * FROM public.books`;
  }
  const { rows } = books;

  return { status: true, result: rows };
}
