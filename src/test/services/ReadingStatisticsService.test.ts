import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/UserService', () => ({
  getUserEmail: vi.fn(),
}));

vi.mock('@/services/repositories/ReadingStatisticsRepository', () => ({
  default: {
    getDailyReadingStats: vi.fn(),
    getTotalPageCount: vi.fn(),
    getBookTags: vi.fn(),
    findBooksByDateRange: vi.fn(),
    getAggregatedStats: vi.fn(),
    getLast30DaysDailyStats: vi.fn(),
    getHourlyStats: vi.fn(),
  },
}));

vi.mock('@/services/repositories/BookRepository', () => ({
  default: {
    getBooksFinishedInMonth: vi.fn(),
  },
}));

vi.mock('@/services/BookService', () => ({
  getMyBooks: vi.fn(),
}));

import {
  getCalendarData,
  getMyStats,
  getYearlyRecap,
} from '@/services/ReadingStatisticsService';
import { getUserEmail } from '@/services/UserService';
import readingStatisticsRepository from '@/services/repositories/ReadingStatisticsRepository';
import bookRepository from '@/services/repositories/BookRepository';
import { getMyBooks } from '@/services/BookService';

const mockedGetUserEmail = vi.mocked(getUserEmail);
const mockedReadingStats = vi.mocked(readingStatisticsRepository);
const mockedBookRepository = vi.mocked(bookRepository);
const mockedGetMyBooks = vi.mocked(getMyBooks);

describe('ReadingStatisticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns auth error when user missing (calendar)', async () => {
    mockedGetUserEmail.mockResolvedValue('' as any);
    const result = await getCalendarData(1, 2024);

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated');
  });

  it('merges sessions and finished books for calendar', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedReadingStats.getDailyReadingStats.mockResolvedValue([
      {
        date: '2024-01-10',
        totalDuration: 120,
        booksRead: 1,
        details: [
          {
            bookId: 'g1',
            title: 'Book 1',
            start_date: '2024-01-01',
            duration: 120,
          },
        ],
      },
    ] as any);
    mockedBookRepository.getBooksFinishedInMonth.mockResolvedValue([
      {
        google_id: 'g1',
        title: 'Book 1',
        finish_date: '2024-01-10',
        start_date: '2024-01-01',
        thumbnail_url: 'x',
      },
      {
        google_id: 'g2',
        title: 'Book 2',
        finish_date: '2024-01-10',
        start_date: '2024-01-05',
        thumbnail_url: 'y',
      },
    ] as any);

    const result = await getCalendarData(1, 2024);
    expect(result.success).toBe(true);
    const day = result.data?.[0];
    expect(day?.details.find((d) => d.bookId === 'g1')?.isFinishedEvent).toBe(
      true,
    );
    expect(day?.details.find((d) => d.bookId === 'g2')?.isFinishedEvent).toBe(
      true,
    );
    expect(day?.booksRead).toBe(2);
  });

  it('returns stats with computed totals', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedReadingStats.getBookTags.mockResolvedValue(['Fiction / Mystery']);
    mockedReadingStats.findBooksByDateRange.mockResolvedValueOnce([
      { title: 'Last Book', google_id: 'g1', tags: 'Fiction / Mystery' },
    ] as any);
    mockedReadingStats.findBooksByDateRange.mockResolvedValueOnce([
      { page_count: 200 },
      { page_count: 100 },
    ] as any);
    mockedReadingStats.findBooksByDateRange.mockResolvedValueOnce([
      { tags: 'Fiction / Mystery, Science Fiction' },
    ] as any);
    mockedReadingStats.getTotalPageCount.mockResolvedValue(300);
    mockedGetMyBooks.mockResolvedValue({ success: true, data: [] } as any);
    mockedReadingStats.getAggregatedStats.mockResolvedValue({
      total_books_read: 3,
    } as any);
    mockedReadingStats.getLast30DaysDailyStats.mockResolvedValue([] as any);
    mockedReadingStats.getHourlyStats.mockResolvedValue([] as any);

    const result = await getMyStats();
    expect(result.success).toBe(true);
    expect(result.data?.page.totalPageCount).toBe(300);
    expect(result.data?.page.lastMonthCount).toBe(300);
    expect(result.data?.tag.tagCount).toBe(2);
  });

  it('returns yearly recap data', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedReadingStats.findBooksByDateRange.mockResolvedValue([
      {
        title: 'A',
        page_count: 100,
        finish_date: '2024-02-01',
        tags: 'Mystery, Sci-Fi',
      },
      {
        title: 'B',
        page_count: 200,
        finish_date: '2024-02-15',
        tags: 'Mystery',
      },
    ] as any);

    const result = await getYearlyRecap(2024);
    expect(result.success).toBe(true);
    expect(result.data?.totalBooks).toBe(2);
    expect(result.data?.totalPages).toBe(300);
    expect(result.data?.topGenres[0].tag).toBe('Mystery');
  });
});
