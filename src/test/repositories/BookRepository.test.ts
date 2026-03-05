import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import bookRepository from '@/services/repositories/BookRepository';
import { createTestDatabase } from '@/test/db/setupTestDb';
import { BookStatus } from '@/types/Book';

let testDb: ReturnType<typeof createTestDatabase>;

vi.mock('@/services/database/kysely', () => {
  return {
    db: {
      __isTestDb: true,
      selectFrom: (...args: any[]) => (globalThis as any).__kysely.selectFrom(...args),
      insertInto: (...args: any[]) => (globalThis as any).__kysely.insertInto(...args),
      updateTable: (...args: any[]) => (globalThis as any).__kysely.updateTable(...args),
      deleteFrom: (...args: any[]) => (globalThis as any).__kysely.deleteFrom(...args),
      fn: (...args: any[]) => (globalThis as any).__kysely.fn(...args),
      transaction: (...args: any[]) => (globalThis as any).__kysely.transaction(...args),
    },
  };
});

vi.mock('@/services/StorageService', () => ({
  uploadBookThumbnail: vi.fn().mockResolvedValue('https://cdn.test/thumb.jpg'),
  removeBookThumbnail: vi.fn(),
}));

describe('BookRepository (integration)', () => {
  beforeEach(async () => {
    testDb = createTestDatabase();
    (globalThis as any).__kysely = testDb.db;

    await testDb.db
      .insertInto('readit_users')
      .values({ email: 'user@test.com', name: 'User' })
      .execute();

    await testDb.db
      .insertInto('readit_book_status')
      .values([
        { cd_status: 'WANT', ds_status: 'Want' },
        { cd_status: 'READING', ds_status: 'Reading' },
        { cd_status: 'READ', ds_status: 'Read' },
      ])
      .execute();

    await testDb.db
      .insertInto('readit_book_type')
      .values({ name: 'Default', code: 'default' })
      .execute();
  });

  afterEach(async () => {
    await testDb.db.destroy();
    testDb.sqlite.close();
  });

  it('creates and finds books by status', async () => {
    await bookRepository.createBook({
      google_id: 'g1',
      title: 'Book 1',
      user_email: 'user@test.com',
      tags: 'Fiction',
      thumbnail_url: 'http://thumb',
    } as any);

    await testDb.db
      .insertInto('readit_books')
      .values({
        google_id: 'g2',
        title: 'Book 2',
        user_email: 'user@test.com',
        id_book_status: BookStatus.READING,
        book_type_id: 1,
      })
      .execute();

    const want = await bookRepository.findBooksByStatus(
      'user@test.com',
      BookStatus.WANT_TO_READ,
    );
    const reading = await bookRepository.findBooksByStatus(
      'user@test.com',
      BookStatus.READING,
    );

    expect(want).toHaveLength(1);
    expect(reading).toHaveLength(1);
  });

  it('updates status and dates', async () => {
    await testDb.db
      .insertInto('readit_books')
      .values({
        google_id: 'g1',
        title: 'Book 1',
        user_email: 'user@test.com',
        id_book_status: BookStatus.WANT_TO_READ,
        book_type_id: 1,
      })
      .execute();

    await bookRepository.updateBookStatus(
      'g1',
      'user@test.com',
      BookStatus.READING,
      { startDate: '2024-01-01 12:00:00' },
    );

    const book = await bookRepository.findBookByGoogleId(
      'g1',
      'user@test.com',
    );
    expect(book?.start_date).toBe('2024-01-01 12:00:00');
  });

  it('records last reading info', async () => {
    await testDb.db
      .insertInto('readit_user_devices')
      .values({
        id: 1,
        user_email: 'user@test.com',
        device_code: 'dev',
        device_name: 'Kindle',
      })
      .execute();

    await testDb.db
      .insertInto('readit_books')
      .values({
        google_id: 'g1',
        title: 'Book 1',
        user_email: 'user@test.com',
        id_book_status: BookStatus.READING,
        book_hash: 'hash',
        book_type_id: 1,
      })
      .execute();

    await bookRepository.recordLastReadingInfo({
      totalReadPages: 10,
      totalReadTime: 100,
      lastOpen: '123',
      hash: 'hash',
      deviceCode: 'dev',
    });

    const book = await bookRepository.findBookByGoogleId(
      'g1',
      'user@test.com',
    );
    expect(book?.book_total_read_pages).toBe(10);
    expect(book?.book_total_read_time).toBe(100);
    expect(book?.book_last_open).toBe('123');
  });
});
