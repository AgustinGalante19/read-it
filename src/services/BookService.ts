'use server';

import { revalidatePath } from 'next/cache';
import { getUserEmail, isAuthenticated } from './UserService';
import { Book, BookStatus, GoogleBookItem } from '@/types/Book';
import { Result } from '@/types/Result';
import GoogleVolumeAdapter from './adapters/GoogleVolumeAdapter';
import ReadDatesHelper from './helpers/ReadDatesHelper';
import bookRepository from './repositories/BookRepository';

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

export async function addBook(book: GoogleBookItem): Promise<Result<string>> {
  try {
    const { volumeInfo } = book;
    const userEmail = await getUserEmail();

    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const volumeData = GoogleVolumeAdapter(volumeInfo);

    await bookRepository.createBook(volumeData);
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
): Promise<Result<(Book & { ds_status: string }) | null>> {
  try {
    const userEmail = await getUserEmail();
    await isAuthenticated(userEmail);

    const book = await bookRepository.findBookByGoogleId(googleId, userEmail);
    return { success: true, data: book };
  } catch (error) {
    console.error('Error checking if book exists:', error);
    return { success: false, error: 'Failed to check book existence' };
  }
}
