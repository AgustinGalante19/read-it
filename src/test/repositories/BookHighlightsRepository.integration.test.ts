import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestDatabase } from '@/test/db/setupTestDb';
import bookHighlightsRepository from '@/services/repositories/BookHighlightsRepository';
import bookRepository from '@/services/repositories/BookRepository';
import type { BookHighlightInput } from '@/types/BookHighlight';

let testDb: ReturnType<typeof createTestDatabase>;

vi.mock('@/services/database/kysely', () => ({
  db: {
    get selectFrom() { return testDb.db.selectFrom.bind(testDb.db); },
    get insertInto() { return testDb.db.insertInto.bind(testDb.db); },
    get updateTable() { return testDb.db.updateTable.bind(testDb.db); },
    get deleteFrom() { return testDb.db.deleteFrom.bind(testDb.db); },
  },
}));
vi.mock('@/services/StorageService', () => ({
  uploadBookThumbnail: vi.fn(),
  removeBookThumbnail: vi.fn(),
}));

const highlight: BookHighlightInput = {
  id: 0,
  google_id: 'g1',
  user_email: 'user@test.com',
  book_hash: null,
  device_code: null,
  is_note: false,
  highlight_text: 'A passage worth keeping',
  page: 12,
  created_at: '2026-11-24T10:00:00Z',
};

describe('BookHighlightsRepository (integration)', () => {
  beforeEach(() => {
    testDb = createTestDatabase();
    testDb.sqlite.pragma('foreign_keys = ON');
    testDb.sqlite.exec(`
      INSERT INTO readit_users (email) VALUES ('user@test.com'), ('other@test.com');
      INSERT INTO readit_books (google_id, title, user_email) VALUES
        ('g1', 'Physical book', 'user@test.com'),
        ('g1', 'Same book, another reader', 'other@test.com');
      INSERT INTO readit_user_devices (device_code, user_email) VALUES
        ('dev', 'user@test.com'), ('other-dev', 'other@test.com');
    `);
  });

  afterEach(async () => {
    await testDb.db.destroy();
    testDb.sqlite.close();
  });

  it('retrieves a physical book citation and note without assigning a hash', async () => {
    await bookHighlightsRepository.createHighlight(highlight);
    await bookHighlightsRepository.createHighlight({ ...highlight, is_note: true, highlight_text: 'Las meninas' });

    const rows = await bookHighlightsRepository.getHighlights('g1', 'user@test.com');
    expect(rows.map((row) => row.is_note)).toEqual([false, true]);
    expect(rows.map((row) => row.highlight_text)).toEqual(['A passage worth keeping', 'Las meninas']);
    expect(await bookRepository.findBookByGoogleId('g1', 'user@test.com')).toMatchObject({ book_hash: null });
    expect(await bookHighlightsRepository.getAllUserHighlights('other@test.com')).toEqual([]);
  });

  it('keeps highlights attached when a physical book is linked and its file hash changes', async () => {
    await bookHighlightsRepository.createHighlight(highlight);
    await bookRepository.updateHash('g1', 'file-1', 100, 'dev');
    await bookHighlightsRepository.createHighlight({ ...highlight, book_hash: 'file-1', device_code: 'dev' });
    await bookRepository.updateHash('g1', 'file-2', 120, 'dev');

    expect(await bookHighlightsRepository.getHighlights('g1', 'user@test.com')).toHaveLength(2);
    expect(await bookRepository.findBookByHashAndDevice('file-2', 'dev')).toEqual({
      google_id: 'g1', user_email: 'user@test.com',
    });
    expect(await bookRepository.findBookByHashAndDevice('file-2', 'other-dev')).toBeUndefined();
    expect(await bookRepository.findBookByHashAndDevice('unknown', 'dev')).toBeUndefined();
  });

  it('scopes reads, reclassification and deletion to the owner even for the same google_id', async () => {
    await bookHighlightsRepository.createHighlight(highlight);
    await bookHighlightsRepository.createHighlight({ ...highlight, user_email: 'other@test.com', is_note: true });
    const [own] = await bookHighlightsRepository.getAllUserHighlights('user@test.com');
    const [other] = await bookHighlightsRepository.getAllUserHighlights('other@test.com');

    expect(own.book_id).not.toBe(other.book_id);
    expect(await bookHighlightsRepository.getHighlightById(own.highlight_id, 'other@test.com')).toBeUndefined();
    await bookHighlightsRepository.updateHighlightType(own.highlight_id, 'other@test.com', true);
    await bookHighlightsRepository.deleteHighlight(own.highlight_id, 'other@test.com');
    expect(await bookHighlightsRepository.getHighlightById(own.highlight_id, 'user@test.com')).toMatchObject({ is_note: false });

    await bookHighlightsRepository.updateHighlightType(own.highlight_id, 'user@test.com', true);
    expect(await bookHighlightsRepository.getHighlightById(own.highlight_id, 'user@test.com')).toMatchObject({ is_note: true });
    await bookHighlightsRepository.deleteHighlight(own.highlight_id, 'user@test.com');
    expect(await bookHighlightsRepository.getAllUserHighlights('user@test.com')).toEqual([]);
    expect(await bookHighlightsRepository.getAllUserHighlights('other@test.com')).toHaveLength(1);
  });

  it('enforces book ownership and boolean categories in the database', async () => {
    await expect(bookHighlightsRepository.createHighlight({ ...highlight, google_id: 'missing' })).rejects.toThrow();
    expect(() => testDb.sqlite.prepare(`
      INSERT INTO readit_books_highlights (google_id, user_email, is_note)
      VALUES ('g1', 'user@test.com', 2)
    `).run()).toThrow();
  });
});
