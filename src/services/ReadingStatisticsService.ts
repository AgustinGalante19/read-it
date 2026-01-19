'use server';

import { Result } from '@/types/Result';
import readingStatisticsRepository from './repositories/ReadingStatisticsRepository';
import { getUserEmail } from './UserService';
import bookRepository from './repositories/BookRepository';
import { Book, BookStatus } from '@/types/Book';
import bookTagsHelper from './helpers/BookTagsHelper';
import datesHelper from './helpers/DatesHelper';
import Stats, { TagRadarData, YearlyRecap } from '@/types/Stats';
import { getMyBooks } from './BookService';
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
  sessions: ReadingSession[],
  deviceCode: string,
): Promise<Result<string>> {
  try {
    await readingStatisticsRepository.saveReadingSessions(
      hash,
      sessions,
      deviceCode,
    );
    return {
      success: true,
      data: `${sessions.length} reading sessions saved successfully`,
    };
  } catch (error) {
    console.error('Error saving reading sessions:', error);
    return { success: false, error: 'Failed to save reading sessions' };
  }
}

export async function getCalendarData(
  month: number,
  year: number,
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
      { month, year },
    );

    // 2. Fetch Finished Books
    const finishedBooks = await bookRepository.getBooksFinishedInMonth(
      userEmail,
      month,
      year,
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
        (d) => d.bookId === book.google_id,
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
        a.date.localeCompare(b.date),
      ),
    };
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return { success: false, error: 'Failed to fetch calendar data' };
  }
}

/**
 * Elimina todas las estadísticas de lectura de un libro
 * @param googleId - ID de Google del libro
 */
export async function deleteReadingStatsByGoogleId(
  googleId: string,
): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    await readingStatisticsRepository.deleteReadingStatsByGoogleId(
      googleId,
      userEmail,
    );

    return {
      success: true,
      data: 'Reading statistics deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting reading statistics:', error);
    return { success: false, error: 'Failed to delete reading statistics' };
  }
}

export async function getPageCount(status = 3): Promise<Result<number>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const totalPages = await readingStatisticsRepository.getTotalPageCount(
      userEmail,
      status,
    );
    return { success: true, data: totalPages };
  } catch {
    return { success: false, error: 'Failed to fetch page count' };
  }
}

export async function getTags(status = 3): Promise<Result<string[]>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const tags = await readingStatisticsRepository.getBookTags(
      userEmail,
      status,
    );
    return { success: true, data: tags };
  } catch {
    return { success: false, error: 'Failed to fetch tags' };
  }
}

export async function getBooksFromDateRange(
  fromDate: Date,
  toDate: Date,
  status = 3,
): Promise<Result<Book[]>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const books = await readingStatisticsRepository.findBooksByDateRange(
      userEmail,
      fromDate,
      toDate,
      status,
    );
    return { success: true, data: books };
  } catch {
    return { success: false, error: 'Failed to fetch books from date range' };
  }
}

export async function getMyStats(
  timezoneOffsetMinutes?: number,
): Promise<Result<Stats>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get tags
    const tagsResult = await getTags();
    if (!tagsResult.success || !tagsResult.data) {
      return { success: false, error: 'Failed to fetch tags' };
    }

    const unrepeatedTags = bookTagsHelper.normalizeBookTags(
      tagsResult.data.map((tag: string) => ({ tags: tag })),
    );

    // Get date ranges
    const { currentDate, result: sixMonthsAgo } = datesHelper.getDateRange(6);
    const { result: oneMonthAgo } = datesHelper.getDateRange(1);

    // Get books from last 6 months
    const last6MonthsResult = await getBooksFromDateRange(
      sixMonthsAgo,
      currentDate,
      3,
    );
    if (!last6MonthsResult.success || !last6MonthsResult.data) {
      return {
        success: false,
        error: 'Failed to fetch books from last 6 months',
      };
    }
    const last6MonthsReadedBooks = last6MonthsResult.data;

    // Get books from last month
    const lastMonthResult = await getBooksFromDateRange(
      oneMonthAgo,
      currentDate,
      3,
    );
    if (!lastMonthResult.success || !lastMonthResult.data) {
      return { success: false, error: 'Failed to fetch books from last month' };
    }

    // Calculate total pages last month
    const totalPagesLastMonth = lastMonthResult.data.reduce((total, book) => {
      return total + parseInt(book.page_count.toString(), 10);
    }, 0);

    // Get total page count
    const pageCountResult = await getPageCount();
    if (!pageCountResult.success) {
      return { success: false, error: 'Failed to fetch total page count' };
    }

    // Get most frequent tag
    const lastBookTags = last6MonthsResult.data[0]?.tags || '';
    const mostFrequentTag = bookTagsHelper.getMostFrequentTag(lastBookTags);

    // Process tags for radar chart (use all read books, not just last 6 months)
    const allReadBooksResult = await getBooksFromDateRange(
      new Date(0), // From beginning of time
      currentDate,
      3, // Only read books
    );

    let radarData: TagRadarData[] = [];
    if (allReadBooksResult.success && allReadBooksResult.data) {
      radarData = bookTagsHelper.processTagsForRadar(allReadBooksResult.data);
    }

    const { data: totalBooks } = await getMyBooks(BookStatus.READ);
    const activityStats =
      await readingStatisticsRepository.getAggregatedStats(userEmail);
    const dailyActivity =
      await readingStatisticsRepository.getLast30DaysDailyStats(userEmail);
    const hourlyActivity = await readingStatisticsRepository.getHourlyStats(
      userEmail,
      timezoneOffsetMinutes,
    );

    const stats: Stats = {
      book: {
        count: tagsResult.data.length,
        lastRead: {
          title: last6MonthsReadedBooks[0]?.title || '',
          googleId: last6MonthsReadedBooks[0]?.google_id || '',
        },
        totalBooks: totalBooks || [],
      },
      page: {
        totalPageCount: pageCountResult.data || 0,
        lastMonthCount: totalPagesLastMonth,
      },
      tag: {
        lastTagReaded: mostFrequentTag,
        tagCount: unrepeatedTags.size,
        radarData: radarData,
      },
      last6MonthsReadedBooks: last6MonthsReadedBooks,
      activity: activityStats,
      dailyActivity,
      hourlyActivity,
    };
    console.log(stats);
    return { success: true, data: stats };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

export async function getYearlyRecap(
  year: number,
): Promise<Result<YearlyRecap>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const booksResult = await getBooksFromDateRange(
      startDate,
      endDate,
      BookStatus.READ,
    );

    if (!booksResult.success || !booksResult.data) {
      return { success: false, error: 'Failed to fetch books for recap' };
    }

    const books = booksResult.data;
    const totalBooks = books.length;

    // Total pages
    const totalPages = books.reduce(
      (sum, book) => sum + (book.page_count || 0),
      0,
    );

    // Longest and shortest book
    const sortedByLength = [...books].sort(
      (a, b) => (b.page_count || 0) - (a.page_count || 0),
    );
    const longestBook = sortedByLength[0];
    const shortestBook = sortedByLength[sortedByLength.length - 1];

    // Top genres
    const tagCounts: Record<string, number> = {};
    books.forEach((book) => {
      if (book.tags) {
        // Assume tags are comma separated or similar.
        // bookTagsHelper.normalizeBookTags uses string[] input.
        // Let's assume tags is a string, possibly multiple tags.
        // Looking at Book.ts, tags: string.
        // I should check how they are stored. Usually comma separated?
        // Let's try to split by comma if it looks like that, otherwise just count as one.
        const tags = book.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t);
        tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Most active month
    const monthCounts: Record<string, number> = {};
    books.forEach((book) => {
      // Use finish_date if available
      if (book.finish_date) {
        const date = new Date(book.finish_date);
        const month = date.toLocaleString('default', { month: 'long' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });

    const mostActiveMonthEntry = Object.entries(monthCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const mostActiveMonth = mostActiveMonthEntry
      ? { month: mostActiveMonthEntry[0], count: mostActiveMonthEntry[1] }
      : { month: 'N/A', count: 0 };

    return {
      success: true,
      data: {
        year,
        totalBooks,
        totalPages,
        books,
        topGenres,
        longestBook,
        shortestBook,
        mostActiveMonth,
      },
    };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to generate yearly recap' };
  }
}
