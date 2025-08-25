'use server';

import { getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import getDateRange from '@/lib/getDateRange';
import normalizeBookTags from '@/lib/normalizeBookTags';
import { Book, BookStatus, GoogleBookItem } from '@/types/Book';
import Stats from '@/types/Stats';
import { revalidatePath } from 'next/cache';
import { getUserEmail } from './User';
import getMostFrequentTag from '@/lib/getMostFrequentTag';
import { turso } from './turso';
import { ResultSet } from '@libsql/client/web';

interface Response<T> {
  status: boolean;
  result: T;
}

function bookDbDefinitionMap(dbResponse: ResultSet) {
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

export async function getMyBooks(
  status: BookStatus
): Promise<Response<Book[]>> {
  let books;

  const userEmail = await getUserEmail();

  if (status === 'readed') {
    books = await turso.execute({
      sql: `SELECT * FROM readit_books WHERE id_book_status = 3 AND user_email = ? ORDER BY inserted_at DESC`,
      args: [userEmail],
    });
  } else if (status === 'notReaded') {
    books = await turso.execute({
      sql: `SELECT * FROM readit_books WHERE id_book_status = 1 AND user_email = ? ORDER BY inserted_at DESC`,
      args: [userEmail],
    });
  } else {
    books = await turso.execute({
      sql: `SELECT * FROM readit_books WHERE user_email = ? ORDER BY inserted_at DESC`,
      args: [userEmail],
    });
  }

  const mappedResult: Book[] = bookDbDefinitionMap(books);

  return { status: true, result: mappedResult };
}

export async function addBook(book: GoogleBookItem): Promise<Response<string>> {
  try {
    const { title, pageCount, publishedDate, authors, imageLinks } =
      book.volumeInfo;

    const userEmail = await getUserEmail();

    const volumePublishedDate = getDateString(publishedDate);
    const volumeImage = imageLinks?.thumbnail || '/thumbnail-fallback.jpg';
    const volumeAuthors = getAuthorsString(authors);
    const volumeCategories = book.volumeInfo?.categories?.join(', ') || '';

    await turso.execute({
      sql: `INSERT INTO readit_books (google_id, title, thumbnail_url, authors, publish_date, page_count, tags, user_email, id_book_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      args: [
        book.id,
        title,
        volumeImage,
        volumeAuthors,
        volumePublishedDate,
        pageCount,
        volumeCategories,
        userEmail,
        1,
      ],
    });

    revalidatePath('/book', 'layout');
    revalidatePath('/');
    revalidatePath('/stats');
    return { status: true, result: 'Book added successfully' };
  } catch {
    return { status: false, result: 'Something went wrong' };
  }
}

export async function updateBookStatus(newStatus: number, googleId: string) {
  try {
    const userEmail = await getUserEmail();
    const currentDate = new Date().toISOString().split('T')[0]; // formato yyyy-mm-dd

    if (newStatus === 1) {
      await turso.execute({
        sql: `UPDATE readit_books SET id_book_status = ?, start_date = NULL, finish_date = NULL WHERE google_id = ? AND user_email = ?;`,
        args: [newStatus, googleId, userEmail],
      });
    } else if (newStatus === 2) {
      await turso.execute({
        sql: `UPDATE readit_books SET id_book_status = ?, start_date = ? WHERE google_id = ? AND user_email = ?;`,
        args: [newStatus, currentDate, googleId, userEmail],
      });
    } else if (newStatus === 3) {
      const bookCheck = await turso.execute({
        sql: `SELECT start_date FROM readit_books WHERE google_id = ? AND user_email = ?;`,
        args: [googleId, userEmail],
      });

      const startDate = bookCheck.rows[0]?.start_date;

      if (!startDate || startDate === null || startDate === '') {
        await turso.execute({
          sql: `UPDATE readit_books SET id_book_status = ?, start_date = ?, finish_date = ? WHERE google_id = ? AND user_email = ?;`,
          args: [newStatus, currentDate, currentDate, googleId, userEmail],
        });
      } else {
        await turso.execute({
          sql: `UPDATE readit_books SET id_book_status = ?, finish_date = ? WHERE google_id = ? AND user_email = ?;`,
          args: [newStatus, currentDate, googleId, userEmail],
        });
      }
    }

    revalidatePath('/book', 'layout');
    revalidatePath('/');
    revalidatePath('/stats');
    revalidatePath('/calendar');
  } catch {
    return { status: false, result: 'Something went wrong' };
  }
}

export async function updateBookDates(
  googleId: string,
  { from, to }: { from: string | null; to: string | null }
) {
  try {
    const userEmail = await getUserEmail();

    await turso.execute({
      sql: `UPDATE readit_books SET start_date = ?, finish_date = ? WHERE google_id = ? AND user_email = ?;`,
      args: [from, to, googleId, userEmail],
    });

    revalidatePath('/book', 'layout');
    revalidatePath('/');
    revalidatePath('/stats');
    revalidatePath('/calendar');
    return { status: true, result: 'Book dates updated successfully' };
  } catch {
    return { status: false, result: 'Something went wrong' };
  }
}

export async function removeFromLibrary(
  id: string
): Promise<Response<boolean>> {
  const userEmail = await getUserEmail();

  await turso.execute({
    sql: `DELETE FROM readit_books WHERE google_id = ? AND user_email = ?;`,
    args: [id, userEmail],
  });
  revalidatePath('/book', 'layout');
  revalidatePath('/');
  revalidatePath('/stats');
  return { result: true, status: true };
}

export async function existsOnLibrary(
  id: string
): Promise<Response<(Book & { ds_status: string }) | null>> {
  const userEmail = await getUserEmail();
  if (!userEmail) return { status: false, result: null };
  const exists = await turso.execute({
    sql: `SELECT b.*, bs.ds_status  
          FROM readit_books b 
          JOIN readit_book_status bs ON b.id_book_status = bs.id  
          WHERE google_id = ? 
          AND user_email = ?;`,
    args: [id, userEmail],
  });

  const books = exists.rows.map((book) => ({
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
    ds_status: String(book.ds_status),
  }));

  if (books.length > 0) {
    return { status: true, result: books[0] };
  }
  return { status: false, result: null };
}

/*
 * Stats page
 */
export async function getPageCount(status = 3): Promise<Response<number>> {
  const userEmail = await getUserEmail();
  const { rows } = await turso.execute({
    sql: `SELECT SUM(page_count) as total_pages FROM readit_books WHERE user_email = ? AND id_book_status = ?;`,
    args: [userEmail, status],
  });

  return { status: true, result: Number(rows[0]?.total_pages) || 0 };
}

export async function getTags(
  status = 3
): Promise<Response<{ tags: string }[]>> {
  const userEmail = await getUserEmail();

  const { rows } = await turso.execute({
    sql: `SELECT tags FROM readit_books WHERE id_book_status = ? and user_email = ?;`,
    args: [status, userEmail],
  });

  const result = rows.map((row) => ({
    tags: String(row.tags),
  }));

  return { status: true, result: result };
}

export async function getBooksFromUntilAgo(
  { from, untilAgo, status } = {
    from: new Date(),
    status: 3,
    untilAgo: new Date(),
  }
): Promise<Response<Book[]>> {
  const userEmail = await getUserEmail();
  console.log({ from, untilAgo });
  const result = await turso.execute({
    sql: `SELECT * 
          FROM readit_books 
          WHERE user_email = ?
          AND id_book_status = ?
          AND finish_date
          BETWEEN ?
          AND ?
          ORDER BY finish_date DESC;`,
    args: [userEmail, status, from.toISOString(), untilAgo.toISOString()],
  });

  return { status: true, result: bookDbDefinitionMap(result) };
}

export async function getMyStats(): Promise<Response<Stats>> {
  const tags = await getTags();
  const unrepeatedTags = normalizeBookTags(tags.result);

  const { currentDate, result: sixMonthsAgo } = getDateRange(6);

  const { result: last6MonthsReadedBooks } = await getBooksFromUntilAgo({
    from: sixMonthsAgo,
    untilAgo: currentDate,
    status: 3,
  });

  const { result: oneMonthAgo } = getDateRange(1);
  const { result: booksLastMonth } = await getBooksFromUntilAgo({
    from: oneMonthAgo,
    untilAgo: currentDate,
    status: 3,
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
