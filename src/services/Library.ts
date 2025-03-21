'use server';

import { getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import getDateRange from '@/lib/getDateRange';
import normalizeBookTags from '@/lib/normalizeBookTags';
import { Book, BookStatus, GoogleBookItem } from '@/types/Book';
import Stats from '@/types/Stats';
import { QueryResult, sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { getUserEmail } from './User';
import getMostFrequentTag from '@/lib/getMostFrequentTag';

interface Response<T> {
  status: boolean;
  result: T;
}

export async function addBook(book: GoogleBookItem): Promise<Response<string>> {
  try {
    const { title, pageCount, publishedDate, authors, imageLinks } =
      book.volumeInfo;

    const userEmail = await getUserEmail();

    const volumePublishedDate = getDateString(publishedDate);
    const volumeImage = imageLinks?.thumbnail || '/thumbnail-fallback.jpg';
    const volumeAuthors = getAuthorsString(authors);
    const volumeCategories = book.volumeInfo?.categories?.join(', ');

    await sql`INSERT INTO public.books(google_id, title, thumbnail_url, authors, publish_date, is_readed, page_count, tags, user_email)
	VALUES (
    ${book.id}, ${title}, ${volumeImage}, ${volumeAuthors}, ${volumePublishedDate}, false, ${pageCount}, ${volumeCategories}, ${userEmail});`;

    revalidatePath('/book', 'layout');
    revalidatePath('/');
    revalidatePath('/stats');
    return { status: true, result: 'Book added successfully' };
  } catch (err) {
    console.log(err);
    return { status: false, result: 'Something went wrong' };
  }
}

export async function existsOnLibrary(
  id: string
): Promise<Response<Book | null>> {
  const userEmail = await getUserEmail();

  const exists: QueryResult<Book> =
    await sql`SELECT * FROM public.books WHERE google_id = ${id} and user_email = ${userEmail};`;

  if (exists.rows.length > 0) {
    return { status: true, result: exists.rows[0] };
  }
  return { status: false, result: null };
}

export async function updateReadStatus(
  id: string,
  newStatus: boolean
): Promise<Response<string>> {
  const userEmail = await getUserEmail();
  if (newStatus) {
    await sql`UPDATE public.books SET is_readed = ${newStatus}, readed_at = ${new Date().toISOString()} WHERE google_id = ${id} and user_email = ${userEmail}`;
  } else {
    await sql`UPDATE public.books SET is_readed = ${newStatus}, readed_at = null WHERE google_id = ${id} and user_email = ${userEmail}`;
  }

  revalidatePath('/book', 'layout');
  revalidatePath('/');
  revalidatePath('/stats');
  revalidatePath('/calendar');
  return { status: true, result: 'Status updated successfully' };
}

export async function removeFromLibrary(
  id: string
): Promise<Response<boolean>> {
  const userEmail = await getUserEmail();

  await sql`DELETE FROM public.books WHERE google_id = ${id} and user_email = ${userEmail}`;
  revalidatePath('/book', 'layout');
  revalidatePath('/');
  revalidatePath('/stats');
  return { result: true, status: true };
}

export async function getMyBooks(
  status: BookStatus
): Promise<Response<Book[]>> {
  let books: QueryResult<Book>;

  const userEmail = await getUserEmail();

  if (status === 'readed') {
    books =
      await sql`SELECT * FROM public.books WHERE is_readed = true AND user_email = ${userEmail} ORDER by inserted_at DESC`;
  } else if (status === 'notReaded') {
    books =
      await sql`SELECT * FROM public.books WHERE is_readed = false AND user_email = ${userEmail} ORDER by inserted_at DESC`;
  } else {
    books =
      await sql`SELECT * FROM public.books WHERE user_email = ${userEmail} ORDER by inserted_at DESC`;
  }
  const { rows } = books;

  return { status: true, result: rows };
}

export async function getPageCount(status = true): Promise<Response<number>> {
  const userEmail = await getUserEmail();
  const { rows }: QueryResult<{ total_pages: number }> =
    await sql`SELECT SUM(page_count) AS total_pages 
            FROM books WHERE is_readed = ${status} and user_email = ${userEmail};`;

  return { status: true, result: rows[0]?.total_pages || 0 };
}

export async function getTags(
  status = true
): Promise<Response<{ tags: string }[]>> {
  const userEmail = await getUserEmail();

  const { rows }: QueryResult<{ tags: string }> =
    await sql`SELECT tags FROM books WHERE is_readed = ${status} and user_email = ${userEmail};`;

  return { status: true, result: rows };
}

export async function getBooksFromUntilAgo(
  { from, untilAgo, status } = {
    from: new Date(),
    status: true,
    untilAgo: new Date(),
  }
): Promise<Response<Book[]>> {
  const userEmail = await getUserEmail();

  const { rows }: QueryResult<Book> =
    await sql`select * from books where user_email = ${userEmail} and is_readed = ${status} and readed_at between ${from.toISOString()} and ${untilAgo.toISOString()} order by readed_at desc;`;

  return { status: true, result: rows };
}

export async function getMyStats(): Promise<Response<Stats>> {
  const tags = await getTags();
  const unrepeatedTags = normalizeBookTags(tags.result);

  const { currentDate, result: sixMonthsAgo } = getDateRange(6);

  const { result: last6MonthsReadedBooks } = await getBooksFromUntilAgo({
    from: sixMonthsAgo,
    untilAgo: currentDate,
    status: true,
  });

  const { result: oneMonthAgo } = getDateRange(1);
  const { result: booksLastMonth } = await getBooksFromUntilAgo({
    from: oneMonthAgo,
    untilAgo: currentDate,
    status: true,
  });

  const totalPagesLastMonth = booksLastMonth.reduce((total, book) => {
    return total + parseInt(book.page_count.toString(), 10);
  }, 0);

  const pageCount = await getPageCount();

  const lastBookTags = last6MonthsReadedBooks[0]?.tags || '';

  const mostFrequentTag = getMostFrequentTag(lastBookTags);

  return {
    result: {
      book: {
        count: tags.result.length,
        lastRead: {
          title: last6MonthsReadedBooks[0]?.title || '',
          googleId: last6MonthsReadedBooks[0]?.google_id || '',
        },
      },
      page: {
        totalPageCount: pageCount.result,
        lastMonthCount: totalPagesLastMonth,
      },
      tag: {
        lastTagReaded: mostFrequentTag,
        tagCount: unrepeatedTags.size,
      },
      last6MonthsReadedBooks,
    },
    status: true,
  };
}
