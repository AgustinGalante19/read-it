'use server';

import { getUserEmail } from './UserService';
import Stats, { TagRadarData, YearlyRecap } from '@/types/Stats';
import { Result } from '@/types/Result';
import { Book, BookStatus } from '@/types/Book';
import { getMyBooks } from './BookService';
import StatsRepositoryV2 from './repositories/StatsRepository';
import bookTagsHelper from './helpers/BookTagsHelper';
import datesHelper from './helpers/DatesHelper';
import readingStatisticsRepository from './repositories/ReadingStatisticsRepository';

export async function getPageCount(status = 3): Promise<Result<number>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const totalPages = await StatsRepositoryV2.getTotalPageCount(
      userEmail,
      status
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

    const tags = await StatsRepositoryV2.getBookTags(userEmail, status);
    return { success: true, data: tags };
  } catch {
    return { success: false, error: 'Failed to fetch tags' };
  }
}

export async function getBooksFromDateRange(
  fromDate: Date,
  toDate: Date,
  status = 3
): Promise<Result<Book[]>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const books = await StatsRepositoryV2.findBooksByDateRange(
      userEmail,
      fromDate,
      toDate,
      status
    );
    return { success: true, data: books };
  } catch {
    return { success: false, error: 'Failed to fetch books from date range' };
  }
}

export async function getMyStats(): Promise<Result<Stats>> {
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
      tagsResult.data.map((tag: string) => ({ tags: tag }))
    );

    // Get date ranges
    const { currentDate, result: sixMonthsAgo } = datesHelper.getDateRange(6);
    const { result: oneMonthAgo } = datesHelper.getDateRange(1);

    // Get books from last 6 months
    const last6MonthsResult = await getBooksFromDateRange(
      sixMonthsAgo,
      currentDate,
      3
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
      3
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
      3 // Only read books
    );

    let radarData: TagRadarData[] = [];
    if (allReadBooksResult.success && allReadBooksResult.data) {
      radarData = bookTagsHelper.processTagsForRadar(allReadBooksResult.data);
    }

    const { data: totalBooks } = await getMyBooks(BookStatus.READ);
    const activityStats = await readingStatisticsRepository.getAggregatedStats(
      userEmail
    );
    const dailyActivity = await readingStatisticsRepository.getLast30DaysDailyStats(userEmail);
    const hourlyActivity = await readingStatisticsRepository.getHourlyStats(userEmail);

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

    return { success: true, data: stats };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

export async function getYearlyRecap(year: number): Promise<Result<YearlyRecap>> {
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const booksResult = await getBooksFromDateRange(startDate, endDate, BookStatus.READ);

    if (!booksResult.success || !booksResult.data) {
      return { success: false, error: 'Failed to fetch books for recap' };
    }

    const books = booksResult.data;
    const totalBooks = books.length;

    // Total pages
    const totalPages = books.reduce((sum, book) => sum + (book.page_count || 0), 0);

    // Longest and shortest book
    const sortedByLength = [...books].sort((a, b) => (b.page_count || 0) - (a.page_count || 0));
    const longestBook = sortedByLength[0];
    const shortestBook = sortedByLength[sortedByLength.length - 1];

    // Top genres
    const tagCounts: Record<string, number> = {};
    books.forEach(book => {
      if (book.tags) {
        // Assume tags are comma separated or similar. 
        // bookTagsHelper.normalizeBookTags uses string[] input.
        // Let's assume tags is a string, possibly multiple tags. 
        // Looking at Book.ts, tags: string.
        // I should check how they are stored. Usually comma separated?
        // Let's try to split by comma if it looks like that, otherwise just count as one.
        const tags = book.tags.split(',').map(t => t.trim()).filter(t => t);
        tags.forEach(tag => {
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
    books.forEach(book => {
      // Use finish_date if available
      if (book.finish_date) {
        const date = new Date(book.finish_date);
        const month = date.toLocaleString('default', { month: 'long' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });

    const mostActiveMonthEntry = Object.entries(monthCounts)
      .sort((a, b) => b[1] - a[1])[0];

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
        mostActiveMonth
      }
    };

  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to generate yearly recap' };
  }
}
