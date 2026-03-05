import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/UserService', () => ({
  getUserEmail: vi.fn(),
  isAuthenticated: vi.fn(),
}));

vi.mock('@/services/repositories/BookRepository', () => ({
  default: {
    findBooksByStatus: vi.fn(),
    createBook: vi.fn(),
    findBookByGoogleId: vi.fn(),
    updateBookStatus: vi.fn(),
    updateBookDates: vi.fn(),
    deleteBook: vi.fn(),
    updateBookType: vi.fn(),
    updateHash: vi.fn(),
    recordLastReadingInfo: vi.fn(),
    getCurrentlyReadingWithStats: vi.fn(),
  },
}));

vi.mock('@/services/repositories/ReadingStatisticsRepository', () => ({
  default: {
    deleteReadingStatsByGoogleId: vi.fn(),
    getTotalReadTimeByHash: vi.fn(),
    getLastSyncDate: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import {
  addBook,
  updateBookStatus,
  existsOnLibrary,
  updateBookType,
  getCurrentlyReadingStats,
  updateBookHash,
  recordLastReadingInfo,
} from '@/services/BookService';
import { getUserEmail, isAuthenticated } from '@/services/UserService';
import bookRepository from '@/services/repositories/BookRepository';
import readingStatisticsRepository from '@/services/repositories/ReadingStatisticsRepository';
import { revalidatePath } from 'next/cache';
import { BookStatus } from '@/types/Book';

const mockedGetUserEmail = vi.mocked(getUserEmail);
const mockedIsAuthenticated = vi.mocked(isAuthenticated);
const mockedBookRepo = vi.mocked(bookRepository);
const mockedReadingRepo = vi.mocked(readingStatisticsRepository);
const mockedRevalidate = vi.mocked(revalidatePath);

describe('BookService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds book for authenticated user and revalidates', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');

    const result = await addBook({ google_id: 'g1', title: 'Book' } as any);
    expect(result.success).toBe(true);
    expect(mockedBookRepo.createBook).toHaveBeenCalled();
    expect(mockedRevalidate).toHaveBeenCalledWith('/book', 'layout');
  });

  it('updates book status using existing book dates', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedIsAuthenticated.mockResolvedValue({ success: true } as any);
    mockedBookRepo.findBookByGoogleId.mockResolvedValue({
      start_date: '2024-01-01',
    } as any);

    const result = await updateBookStatus(BookStatus.READ, 'g1');
    expect(result.success).toBe(true);
    expect(mockedBookRepo.updateBookStatus).toHaveBeenCalled();
  });

  it('returns last sync metadata when book has hash', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedIsAuthenticated.mockResolvedValue({ success: true } as any);
    mockedBookRepo.findBookByGoogleId.mockResolvedValue({
      google_id: 'g1',
      book_hash: 'hash',
    } as any);
    mockedReadingRepo.getTotalReadTimeByHash.mockResolvedValue(300 as any);
    mockedReadingRepo.getLastSyncDate.mockResolvedValue('2024-01-01' as any);

    const result = await existsOnLibrary('g1');
    expect(result.success).toBe(true);
    expect(result.metadata?.lastSyncDate).toBe('2024-01-01');
  });

  it('updates book type and deletes stats', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedIsAuthenticated.mockResolvedValue({ success: true } as any);

    const result = await updateBookType(2, 'g1');
    expect(result.success).toBe(true);
    expect(mockedReadingRepo.deleteReadingStatsByGoogleId).toHaveBeenCalled();
  });

  it('returns currently reading stats with total read time', async () => {
    mockedGetUserEmail.mockResolvedValue('user@test.com');
    mockedIsAuthenticated.mockResolvedValue({ success: true } as any);
    mockedBookRepo.getCurrentlyReadingWithStats.mockResolvedValue([
      { book_hash: 'hash' },
    ] as any);
    mockedReadingRepo.getTotalReadTimeByHash.mockResolvedValue(100 as any);

    const result = await getCurrentlyReadingStats();
    expect(result.success).toBe(true);
    expect(result.data?.[0].book_total_read_time).toBe(100);
  });

  it('updates book hash and last reading info', async () => {
    const hashResult = await updateBookHash('hash', 'g1', 10, 'dev');
    const lastOpenResult = await recordLastReadingInfo({
      totalReadPages: 10,
      totalReadTime: 50,
      lastOpen: '123',
      hash: 'hash',
      deviceCode: 'dev',
    });

    expect(hashResult.success).toBe(true);
    expect(lastOpenResult.success).toBe(true);
  });
});
