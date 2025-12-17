'use server';

import { Result } from '@/types/Result';
import readingStatisticsRepository from './repositories/ReadingStatisticsRepository';
import { getUserEmail } from './UserService';
import bookRepository from './repositories/BookRepository';
interface ReadingSession {
  duration: number;
  totalPages: number;
  page: number;
  startTime: string;
}

/**
 * Guarda las sesiones de lectura de un libro
 * @param hash - Hash del libro
 * @param sessions - Array de sesiones de lectura
 */
export async function saveReadingSessions(
  hash: string,
  sessions: ReadingSession[]
): Promise<Result<string>> {
  try {
    await readingStatisticsRepository.saveReadingSessions(hash, sessions);
    return {
      success: true,
      data: `${sessions.length} reading sessions saved successfully`,
    };
  } catch (error) {
    console.error('Error saving reading sessions:', error);
    return { success: false, error: 'Failed to save reading sessions' };
  }
}

/**
 * Obtiene las sesiones de lectura de un libro por su hash
 * @param hash - Hash del libro
 */
export async function getReadingSessionsByHash(
  hash: string
): Promise<Result<ReadingSession[]>> {
  try {
    const sessions = await readingStatisticsRepository.getReadingSessionsByHash(
      hash
    );
    return { success: true, data: sessions };
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    return { success: false, error: 'Failed to fetch reading sessions' };
  }
}

export async function getReadingTimeline(filters?: {
  month?: number;
  year?: number;
  bookId?: string;
}): Promise<
  Result<
    {
      date: string;
      totalDuration: number;
      booksRead: number;
      details: {
        bookId: string;
        title: string;
        duration: number;
        thumbnail_url?: string;
      }[];
    }[]
  >
> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const timeline = await readingStatisticsRepository.getDailyReadingStats(
      userEmail,
      filters
    );
    return { success: true, data: timeline };
  } catch (error) {
    console.error('Error fetching reading timeline:', error);
    return { success: false, error: 'Failed to fetch reading timeline' };
  }
}

export async function getCalendarData(
  month: number,
  year: number
): Promise<
  Result<
    {
      date: string;
      totalDuration: number;
      booksRead: number;
      details: {
        bookId: string;
        title: string;
        start_date: string;
        duration: number;
        thumbnail_url?: string;
        isFinishedEvent?: boolean;
      }[];
    }[]
  >
> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    // 1. Fetch Daily Sessions
    const sessions = await readingStatisticsRepository.getDailyReadingStats(
      userEmail,
      { month, year }
    );

    // 2. Fetch Finished Books
    const finishedBooks = await bookRepository.getBooksFinishedInMonth(
      userEmail,
      month,
      year
    );

    // 3. Merge Data
    // Create a map keyed by date string (YYYY-MM-DD)
    const calendarMap = new Map<
      string,
      {
        date: string;
        totalDuration: number;
        booksRead: number;
        details: {
          bookId: string;
          title: string;
          start_date: string;
          duration: number;
          thumbnail_url?: string;
          isFinishedEvent?: boolean;
        }[];
      }
    >();

    // Initialize map with sessions
    sessions.forEach((session) => {
      calendarMap.set(session.date, {
        ...session,
        details: session.details.map((d) => ({ ...d, isFinishedEvent: false })),
      });
    });

    // Merge finished books
    finishedBooks.forEach((book) => {
      if (!book.finish_date) return;
      // Extract YYYY-MM-DD from finish_date
      const dateKey = new Date(book.finish_date).toISOString().split('T')[0];

      if (!calendarMap.has(dateKey)) {
        calendarMap.set(dateKey, {
          date: dateKey,
          totalDuration: 0,
          booksRead: 0,
          details: [],
        });
      }

      const dayEntry = calendarMap.get(dateKey)!;

      // Check if this book is already present in this day's details (from sessions)
      const existingDetailIndex = dayEntry.details.findIndex(
        (d) => d.bookId === book.google_id
      );

      if (existingDetailIndex !== -1) {
        // Book already has a session this day.
        // We could mark it as finished event too if we want to highlight it.
        dayEntry.details[existingDetailIndex].isFinishedEvent = true;
      } else {
        // Book was finished this day but has no session recorded (or session was on previous days)
        dayEntry.details.push({
          bookId: book.google_id,
          title: book.title,
          duration: 0, // No duration for this specific event
          thumbnail_url: book.thumbnail_url,
          start_date: book.start_date || '',
          isFinishedEvent: true,
        });
        // We don't increment booksRead or totalDuration necessarily if it's just a status update event
        // But maybe we should increment booksRead? The repository logic for sessions counts distinct books read.
        // If we add it here, we should arguably increment booksRead.
        dayEntry.booksRead += 1;
      }
    });

    return {
      success: true,
      data: Array.from(calendarMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    };
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return { success: false, error: 'Failed to fetch calendar data' };
  }
}
