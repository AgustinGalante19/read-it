'use server';

import { revalidatePath } from 'next/cache';
import { getUserEmail, isAuthenticated } from './UserService';
import { Book, BookStatus } from '@/types/Book';
import { Result, ResultWithMetadata } from '@/types/Result';
import ReadDatesHelper from './helpers/ReadDatesHelper';
import bookRepository from './repositories/BookRepository';
import readingStatisticsRepository from './repositories/ReadingStatisticsRepository';
import { format, parseISO } from 'date-fns';
import { BookHighlightPreview } from '@/types/BookHighlight';

async function revalidateBookPaths(): Promise<void> {
  revalidatePath('/book', 'layout');
  revalidatePath('/');
  revalidatePath('/stats');
  revalidatePath('/calendar');
}

export async function getMyBooks(status: BookStatus): Promise<Result<Book[]>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    const books = await bookRepository.findBooksByStatus(userEmail, status);
    return { success: true, data: books };
  } catch (error) {
    console.error('Error fetching books:', error);
    return { success: false, error: 'Failed to fetch books' };
  }
}

export async function addBook(book: Book): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail();

    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }
    await bookRepository.createBook({ ...book, user_email: userEmail });
    await revalidateBookPaths();

    return { success: true, data: 'Book added successfully' };
  } catch (error) {
    console.error('Error adding book:', error);
    return { success: false, error: 'Failed to add book' };
  }
}

export async function updateBookStatus(
  newStatus: number,
  googleId: string
): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    const existingBook = await bookRepository.findBookByGoogleId(
      googleId,
      userEmail
    );
    const dates = ReadDatesHelper(newStatus, existingBook);

    await bookRepository.updateBookStatus(
      googleId,
      userEmail,
      newStatus,
      dates
    );
    await revalidateBookPaths();

    return { success: true, data: 'Book status updated successfully' };
  } catch {
    return { success: false, error: 'Failed to update book status' };
  }
}

export async function updateBookDates(
  googleId: string,
  { from, to }: { from: string | null; to: string | null }
): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    await bookRepository.updateBookDates(googleId, userEmail, from, to);
    await revalidateBookPaths();

    return { success: true, data: 'Book dates updated successfully' };
  } catch {
    return { success: false, error: 'Failed to update book dates' };
  }
}

export async function removeFromLibrary(
  googleId: string
): Promise<Result<boolean>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    await bookRepository.deleteBook(googleId, userEmail);
    await revalidateBookPaths();

    return { success: true, data: true };
  } catch (error) {
    console.error('Error removing book from library:', error);
    return { success: false, error: 'Failed to remove book from library' };
  }
}

export async function existsOnLibrary(
  googleId: string
): Promise<ResultWithMetadata<Book | null, { lastSyncDate: string | null }>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    const book = await bookRepository.findBookByGoogleId(googleId, userEmail);
    let lastSyncDate: string | null = null;

    if (book && book.book_hash) {
      book.book_total_read_time =
        await readingStatisticsRepository.getTotalReadTimeByHash(
          book.book_hash,
          userEmail
        );

      lastSyncDate = await readingStatisticsRepository.getLastSyncDate(
        userEmail,
        book.book_hash
      );
      const date = parseISO(lastSyncDate || '');
      lastSyncDate = format(date, 'dd/MM/yyyy HH:mm');
    }
    return {
      success: true,
      data: book,
      metadata: { lastSyncDate },
    };
  } catch (error) {
    console.error('Error checking if book exists:', error);
    return { success: false, error: 'Failed to check book existence' };
  }
}

export async function updateBookType(
  bookTypeId: number,
  googleId: string
): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    await bookRepository.updateBookType(bookTypeId, googleId, userEmail);
    await readingStatisticsRepository.deleteReadingStatsByGoogleId(
      googleId,
      userEmail
    );

    await revalidateBookPaths();

    return { success: true, data: 'Book type updated successfully' };
  } catch (error) {
    console.error('Error updating book type:', error);
    return { success: false, error: 'Failed to update book type' };
  }
}

export async function updateBookHash(
  hash: string,
  googleId: string,
  pageCount: number,
  deviceCode: string
): Promise<Result<string>> {
  try {
    await bookRepository.updateHash(googleId, hash, pageCount, deviceCode);
    return { success: true, data: 'Book hash updated successfully' };
  } catch (error) {
    console.error('Error updating book hash:', error);
    return { success: false, error: 'Failed to update book hash' };
  }
}

export async function recordLastReadingInfo(data: {
  totalReadPages: number;
  totalReadTime: number;
  lastOpen: string;
  hash: string;
  deviceCode: string;
}): Promise<Result<string>> {
  try {
    await bookRepository.recordLastReadingInfo(data);
    return { success: true, data: 'Book last open updated successfully' };
  } catch (error) {
    console.error('Error updating book last open:', error);
    return { success: false, error: 'Failed to update book last open' };
  }
}

export async function getBookHighlights(
  googleId: string
): Promise<Result<BookHighlightPreview[]>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    const highlights = await bookRepository.getHighlights(googleId, userEmail);
    return { success: true, data: highlights };
  } catch (error) {
    console.error('Error getting book highlights:', error);
    return { success: false, error: 'Failed to get book highlights' };
  }
}
