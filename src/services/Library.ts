'use server';

import { getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import { Book, BookStatus, GoogleBookItem } from '@/types/Book';
import { QueryResult, QueryResultRow, sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

interface Response<T> {
  status: boolean;
  result: T;
}

export async function addBook(book: GoogleBookItem): Promise<Response<string>> {
  try {
    const { title, pageCount, publishedDate, authors, imageLinks } =
      book.volumeInfo;

    await sql`INSERT INTO public.books(google_id, title, thumbnail_url, authors, publish_date, is_readed, page_count)
	VALUES (${book.id}, ${title}, ${
      imageLinks?.thumbnail || '/thumbnail-fallback.jpg'
    }, ${getAuthorsString(authors)}, ${getDateString(
      publishedDate
    )}, false, ${pageCount});`;

    revalidatePath('/book');
    revalidatePath('/');
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
  if (newStatus) {
    await sql`UPDATE public.books SET is_readed = ${newStatus}, readed_at = ${new Date().toISOString()} WHERE google_id = ${id}`;
  } else {
    await sql`UPDATE public.books SET is_readed = ${newStatus} WHERE google_id = ${id}`;
  }

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
    books =
      await sql`SELECT * FROM public.books WHERE is_readed = true ORDER by title ASC`;
  } else if (status === 'notReaded') {
    books =
      await sql`SELECT * FROM public.books WHERE is_readed = false ORDER by title ASC`;
  } else {
    books = await sql`SELECT * FROM public.books ORDER by readed_at DESC`;
  }
  const { rows } = books;

  return { status: true, result: rows };
}

export async function getMyStats(): Promise<
  Response<{
    tag: { tagCount: number; lastTagReaded: string };
    book: { bookCount: number; lastBookReaded: string };
    page: { totalPageCount: number; lastMonthCount: number };
    last6MonthsReadedBooks: QueryResultRow;
  }>
> {
  const { rows: pageCountAndTags } =
    await sql`SELECT tags, SUM(page_count) OVER () AS total_pages 
              FROM books WHERE is_readed = true;`;

  const tags = pageCountAndTags.map((book) => book.tags);
  const unrepeatedTags = new Set(
    tags.flatMap((tag) => tag.split('/').map((subTag: string) => subTag.trim()))
  );

  const currentDate = new Date();
  const sixMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 6,
    1
  );

  const { rows: last6MonthsReadedBooks } =
    await sql`select * from books where readed_at between ${sixMonthsAgo.toISOString()} and ${currentDate.toISOString()} order by readed_at desc;`;

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  const booksLastMonth = last6MonthsReadedBooks.filter((book) => {
    const readedAt = new Date(book.readed_at);
    return readedAt >= oneMonthAgo && readedAt <= currentDate;
  });

  const totalPagesLastMonth = booksLastMonth.reduce((total, book) => {
    return total + parseInt(book.page_count, 10);
  }, 0);

  console.log({ currentDate, oneMonthAgo });

  return {
    result: {
      book: {
        bookCount: pageCountAndTags.length,
        lastBookReaded: last6MonthsReadedBooks[0]?.title || '',
      },
      page: {
        totalPageCount: pageCountAndTags[0]?.total_pages || 0,
        lastMonthCount: totalPagesLastMonth,
      },
      tag: {
        lastTagReaded: last6MonthsReadedBooks[0].tags || '',
        tagCount: unrepeatedTags.size,
      },
      last6MonthsReadedBooks,
    },
    status: true,
  };
}
