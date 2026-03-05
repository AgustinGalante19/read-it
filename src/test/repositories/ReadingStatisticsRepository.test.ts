import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestDatabase } from '@/test/db/setupTestDb';

let testDb: ReturnType<typeof createTestDatabase>;
let readingStatisticsRepository: typeof import('@/services/repositories/ReadingStatisticsRepository').default;

vi.mock('@/services/database/kysely', () => {
  return {
    db: {
      selectFrom: (...args: any[]) => (globalThis as any).__kysely.selectFrom(...args),
      insertInto: (...args: any[]) => (globalThis as any).__kysely.insertInto(...args),
      updateTable: (...args: any[]) => (globalThis as any).__kysely.updateTable(...args),
      deleteFrom: (...args: any[]) => (globalThis as any).__kysely.deleteFrom(...args),
      get fn() {
        return (globalThis as any).__kysely.fn;
      },
    },
  };
});

describe('ReadingStatisticsRepository (integration)', () => {
  beforeEach(async () => {
    testDb = createTestDatabase();
    (globalThis as any).__kysely = testDb.db;
    ({ default: readingStatisticsRepository } = await import(
      '@/services/repositories/ReadingStatisticsRepository'
    ));

    await testDb.db
      .insertInto('readit_users')
      .values({ email: 'user@test.com', name: 'User' })
      .execute();

    await testDb.db
      .insertInto('readit_user_devices')
      .values({
        id: 1,
        user_email: 'user@test.com',
        device_code: 'dev1',
        device_name: 'Kindle',
      })
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

    await testDb.db
      .insertInto('readit_books')
      .values({
        google_id: 'g1',
        title: 'Book 1',
        user_email: 'user@test.com',
        book_hash: 'hash1',
        id_book_status: 2,
        book_type_id: 1,
        finish_date: '2024-01-15T00:00:00.000Z',
        tags: 'Mystery',
      })
      .execute();
  });

  afterEach(async () => {
    await testDb.db.destroy();
    testDb.sqlite.close();
  });

  it('saves and reads sessions by hash', async () => {
    await readingStatisticsRepository.saveReadingSessions(
      'hash1',
      [
        {
          duration: 30,
          totalPages: 10,
          page: 10,
          startTime: '2024-01-01T10:00:00Z',
        },
      ],
      'dev1',
    );

    const sessions = await readingStatisticsRepository.getReadingSessionsByHash(
      'hash1',
      'dev1',
    );
    expect(sessions).toHaveLength(1);
    expect(sessions[0].page).toBe(10);
  });

  it('returns daily stats with details', async () => {
    await testDb.db
      .insertInto('readit_page_stat_data')
      .values({
        hash: 'hash1',
        page: 1,
        start_time: new Date('2024-01-01T10:00:00Z').getTime(),
        duration: 10,
        total_pages: 10,
        user_device_code: 'dev1',
      })
      .execute();

    const result = await readingStatisticsRepository.getDailyReadingStats(
      'user@test.com',
      { month: 1, year: 2024 },
    );
    expect(result).toHaveLength(1);
    expect(result[0].details[0].bookId).toBe('g1');
  });

  it('calculates total page count', async () => {
    await testDb.db
      .insertInto('readit_books')
      .values({
        google_id: 'g2',
        title: 'Book 2',
        user_email: 'user@test.com',
        id_book_status: 3,
        page_count: 200,
        book_type_id: 1,
        finish_date: '2024-01-20T00:00:00.000Z',
        tags: 'Thriller',
      })
      .execute();

    const total = await readingStatisticsRepository.getTotalPageCount(
      'user@test.com',
    );
    expect(total).toBe(200);
  });

  it('deletes reading stats by google id', async () => {
    await testDb.db
      .insertInto('readit_page_stat_data')
      .values({
        hash: 'hash1',
        page: 1,
        start_time: 100,
        duration: 10,
        total_pages: 10,
        user_device_code: 'dev1',
      })
      .execute();

    await readingStatisticsRepository.deleteReadingStatsByGoogleId(
      'g1',
      'user@test.com',
    );

    const rows = await testDb.db
      .selectFrom('readit_page_stat_data')
      .selectAll()
      .execute();
    expect(rows).toHaveLength(0);
  });
});
