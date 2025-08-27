'use server';

import { revalidatePath } from 'next/cache';
import * as BookRepository from './repositories/BookRepository';
import { getUserEmail } from './User';
import { Book, BookStatus, GoogleBookItem } from '@/types/Book';
import { getCurrentDateDefault, getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import { Result } from '@/types/Result';

async function revalidateBookPaths(): Promise<void> {
  revalidatePath('/book', 'layout');
  revalidatePath('/');
  revalidatePath('/stats');
  revalidatePath('/calendar');
}

export async function getMyBooks(status: BookStatus): Promise<Result<Book[]>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const books = await BookRepository.findBooksByStatus(userEmail, status);
    return { success: true, data: books };
  } catch (error) {
    console.error('Error fetching books:', error);
    return { success: false, error: 'Failed to fetch books' };
  }
}

export async function addBook(book: GoogleBookItem): Promise<Result<string>> {
  try {
    const { title, pageCount, publishedDate, authors, imageLinks } =
      book.volumeInfo;
    const userEmail = await getUserEmail();

    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const bookData = {
      googleId: book.id,
      title,
      thumbnailUrl: imageLinks?.thumbnail || '/thumbnail-fallback.jpg',
      authors: getAuthorsString(authors),
      publishDate: getDateString(publishedDate),
      pageCount: pageCount || 0,
      tags: book.volumeInfo?.categories?.join(', ') || '',
      userEmail,
    };

    await BookRepository.createBook(bookData);
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
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const currentDate = getCurrentDateDefault();
    const dates: { startDate?: string; finishDate?: string } = {};

    if (newStatus === 2) {
      dates.startDate = currentDate;
    } else if (newStatus === 3) {
      // Check if book has start_date
      const existingBook = await BookRepository.findBookByGoogleId(
        googleId,
        userEmail
      );
      if (!existingBook?.start_date) {
        dates.startDate = currentDate;
      }
      dates.finishDate = currentDate;
    }

    await BookRepository.updateBookStatus(
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
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    await BookRepository.updateBookDates(googleId, userEmail, from, to);
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
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    await BookRepository.deleteBook(googleId, userEmail);
    await revalidateBookPaths();

    return { success: true, data: true };
  } catch (error) {
    console.error('Error removing book from library:', error);
    return { success: false, error: 'Failed to remove book from library' };
  }
}

export async function existsOnLibrary(
  googleId: string
): Promise<Result<(Book & { ds_status: string }) | null>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const book = await BookRepository.findBookByGoogleId(googleId, userEmail);
    return { success: true, data: book };
  } catch (error) {
    console.error('Error checking if book exists:', error);
    return { success: false, error: 'Failed to check book existence' };
  }
}
