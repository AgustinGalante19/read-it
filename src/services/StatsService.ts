import * as BookRepository from './repositories/BookRepository';
import { getUserEmail } from './User';
import getDateRange from '@/lib/getDateRange';
import normalizeBookTags from '@/lib/normalizeBookTags';
import getMostFrequentTag from '@/lib/getMostFrequentTag';
import processTagsForRadar from '@/lib/processTagsForRadar';
import Stats, { TagRadarData } from '@/types/Stats';
import { Result } from '@/types/Result';
import { Book } from '@/types/Book';
import { getMyBooks } from './BookService';

export async function getPageCount(status = 3): Promise<Result<number>> {
  'use server';
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const totalPages = await BookRepository.getTotalPageCount(
      userEmail,
      status
    );
    return { success: true, data: totalPages };
  } catch (error) {
    console.error('Error fetching page count:', error);
    return { success: false, error: 'Failed to fetch page count' };
  }
}

export async function getTags(status = 3): Promise<Result<string[]>> {
  'use server';
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const tags = await BookRepository.getBookTags(userEmail, status);
    return { success: true, data: tags };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { success: false, error: 'Failed to fetch tags' };
  }
}

export async function getBooksFromDateRange(
  fromDate: Date,
  toDate: Date,
  status = 3
): Promise<Result<Book[]>> {
  'use server';
  try {
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return { success: false, error: 'User not authenticated' };
    }

    const books = await BookRepository.findBooksByDateRange(
      userEmail,
      fromDate,
      toDate,
      status
    );
    return { success: true, data: books };
  } catch (error) {
    console.error('Error fetching books from date range:', error);
    return { success: false, error: 'Failed to fetch books from date range' };
  }
}

export async function getMyStats(): Promise<Result<Stats>> {
  'use server';
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

    const unrepeatedTags = normalizeBookTags(
      tagsResult.data.map((tag: string) => ({ tags: tag }))
    );

    // Get date ranges
    const { currentDate, result: sixMonthsAgo } = getDateRange(6);
    const { result: oneMonthAgo } = getDateRange(1);

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
    const mostFrequentTag = getMostFrequentTag(lastBookTags);

    // Process tags for radar chart (use all read books, not just last 6 months)
    const allReadBooksResult = await getBooksFromDateRange(
      new Date(0), // From beginning of time
      currentDate,
      3 // Only read books
    );
    
    let radarData: TagRadarData[] = [];
    if (allReadBooksResult.success && allReadBooksResult.data) {
      radarData = processTagsForRadar(allReadBooksResult.data);
    }

    const {data: totalBooks} = await getMyBooks('readed')

    const stats: Stats = {
      book: {
        count: tagsResult.data.length,
        lastRead: {
          title: last6MonthsResult.data[0]?.title || '',
          googleId: last6MonthsResult.data[0]?.google_id || '',
        },
        totalBooks: totalBooks || []
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
      last6MonthsReadedBooks: last6MonthsResult.data,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}
