'use server';

import { getUserEmail } from './UserService';
import Stats, { TagRadarData } from '@/types/Stats';
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
