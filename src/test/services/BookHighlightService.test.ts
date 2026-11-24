import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Book } from '@/types/Book';
import type { BookHighlightWithBook } from '@/types/BookHighlight';

vi.mock('@/services/UserService', () => ({ getUserEmail: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/services/repositories/BookRepository', () => ({
  default: { findBookByGoogleId: vi.fn(), findBookByHashAndDevice: vi.fn() },
}));
vi.mock('@/services/repositories/BookHighlightsRepository', () => ({
  default: {
    createHighlight: vi.fn(), getHighlightById: vi.fn(), updateHighlightType: vi.fn(),
    deleteHighlight: vi.fn(), getHighlights: vi.fn(), getAllUserHighlights: vi.fn(),
  },
}));

import {
  addBookHighlight, addManualBookHighlight, deleteBookHighlight,
  getAllHighlights, getBookHighlights, updateBookHighlightType,
} from '@/services/BookHighlightService';
import { getUserEmail } from '@/services/UserService';
import bookRepository from '@/services/repositories/BookRepository';
import highlightsRepository from '@/services/repositories/BookHighlightsRepository';
import { revalidatePath } from 'next/cache';

const user = 'user@test.com';
const manual = { googleId: 'g1', highlightText: '  Las meninas  ', page: 42 };
const imported = { id: 0, device_code: 'dev', book_hash: 'hash', page: 42,
  highlight_text: 'A passage', created_at: '2026-11-24T10:00:00Z' };

describe('BookHighlightService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getUserEmail).mockResolvedValue(user);
    vi.mocked(bookRepository.findBookByGoogleId).mockResolvedValue({ google_id: 'g1', book_hash: null } as Book);
    vi.mocked(bookRepository.findBookByHashAndDevice).mockResolvedValue({ google_id: 'g1', user_email: user });
    vi.mocked(highlightsRepository.getHighlightById).mockResolvedValue({ google_id: 'g1' } as BookHighlightWithBook);
  });

  it.each([false, true])('creates a manual record with is_note=%s without a file hash', async (isNote) => {
    expect((await addManualBookHighlight({ ...manual, isNote })).success).toBe(true);
    expect(bookRepository.findBookByGoogleId).toHaveBeenCalledWith('g1', user);
    expect(highlightsRepository.createHighlight).toHaveBeenCalledWith({
      id: 0, google_id: 'g1', user_email: user, book_hash: null,
      device_code: null, is_note: isNote, highlight_text: 'Las meninas', page: 42, created_at: expect.any(Date),
    });
    expect(revalidatePath).toHaveBeenCalledWith('/highlights');
    expect(revalidatePath).toHaveBeenCalledWith('/book/g1');
  });

  it('defaults manual entries to quotes and does not reuse an electronic book hash', async () => {
    vi.mocked(bookRepository.findBookByGoogleId).mockResolvedValue({ google_id: 'g1', book_hash: 'real' } as Book);
    await addManualBookHighlight(manual);
    expect(highlightsRepository.createHighlight).toHaveBeenCalledWith(expect.objectContaining({ is_note: false, book_hash: null }));
  });

  it('rejects a manual entry for a book outside the current library', async () => {
    vi.mocked(bookRepository.findBookByGoogleId).mockResolvedValue(null);
    expect((await addManualBookHighlight(manual)).success).toBe(false);
    expect(highlightsRepository.createHighlight).not.toHaveBeenCalled();
  });

  it.each([
    { highlightText: '' }, { highlightText: '   ' }, { page: -1 }, { page: 1.5 }, { page: NaN },
    { googleId: '' }, { isNote: 'true' },
  ])('rejects invalid manual fields %j before writing', async (fields) => {
    expect((await addManualBookHighlight({ ...manual, ...fields } as Parameters<typeof addManualBookHighlight>[0])).success).toBe(false);
    expect(highlightsRepository.createHighlight).not.toHaveBeenCalled();
  });

  it.each([true, false, undefined])('resolves KOReader ownership and persists isNote=%s as is_note', async (isNote) => {
    // Ownership and the stored category come from the validated fields, not raw database fields.
    await addBookHighlight({ ...imported, isNote, is_note: !isNote, user_email: 'other@test.com', google_id: 'wrong' } as typeof imported);
    expect(bookRepository.findBookByHashAndDevice).toHaveBeenCalledWith('hash', 'dev');
    expect(highlightsRepository.createHighlight).toHaveBeenCalledWith({
      ...imported, google_id: 'g1', user_email: user, is_note: isNote ?? false,
    });
  });

  it.each(['true', 'false', null, 0, 1, {}, []])('rejects non-boolean KOReader isNote=%j before accessing the book', async (isNote) => {
    const result = await addBookHighlight({ ...imported, isNote } as Parameters<typeof addBookHighlight>[0]);
    expect(result).toEqual({ success: false, error: 'isNote must be a boolean', status: 400 });
    expect(bookRepository.findBookByHashAndDevice).not.toHaveBeenCalled();
    expect(highlightsRepository.createHighlight).not.toHaveBeenCalled();
  });

  it('rejects an unknown hash or a book owned by another device user', async () => {
    vi.mocked(bookRepository.findBookByHashAndDevice).mockResolvedValue(undefined);
    expect(await addBookHighlight(imported)).toMatchObject({ success: false, status: 404 });
    expect(highlightsRepository.createHighlight).not.toHaveBeenCalled();
  });

  it('continues accepting a numeric page serialized as text by a device', async () => {
    expect((await addBookHighlight({ ...imported, page: '42' })).success).toBe(true);
    expect(highlightsRepository.createHighlight).toHaveBeenCalledWith(expect.objectContaining({ page: 42 }));
  });

  it('rejects invalid KOReader data before resolving or writing', async () => {
    expect(await addBookHighlight({ ...imported, book_hash: '' })).toMatchObject({ success: false, status: 400 });
    expect(bookRepository.findBookByHashAndDevice).not.toHaveBeenCalled();
    expect(highlightsRepository.createHighlight).not.toHaveBeenCalled();
  });

  it.each([true, false])('reclassifies a record to is_note=%s with ownership checks', async (isNote) => {
    expect((await updateBookHighlightType(7, isNote)).success).toBe(true);
    expect(highlightsRepository.getHighlightById).toHaveBeenCalledWith(7, user);
    expect(highlightsRepository.updateHighlightType).toHaveBeenCalledWith(7, user, isNote);
    expect(revalidatePath).toHaveBeenCalledWith('/book/g1');
  });

  it('cannot reclassify or delete a record belonging to another user', async () => {
    vi.mocked(highlightsRepository.getHighlightById).mockResolvedValue(undefined);
    expect((await updateBookHighlightType(7, true)).success).toBe(false);
    expect((await deleteBookHighlight(7)).success).toBe(false);
    expect(highlightsRepository.updateHighlightType).not.toHaveBeenCalled();
    expect(highlightsRepository.deleteHighlight).not.toHaveBeenCalled();
  });

  it('deletes only the owned record and refreshes its book', async () => {
    expect((await deleteBookHighlight(7)).success).toBe(true);
    expect(highlightsRepository.deleteHighlight).toHaveBeenCalledWith(7, user);
    expect(revalidatePath).toHaveBeenCalledWith('/book/g1');
  });

  it('blocks manual writes, reclassification, deletion and reads without a session', async () => {
    vi.mocked(getUserEmail).mockResolvedValue('');
    const results = await Promise.all([
      addManualBookHighlight(manual), updateBookHighlightType(7, true), deleteBookHighlight(7),
      getAllHighlights(), getBookHighlights('g1'),
    ]);
    expect(results.every((result) => !result.success)).toBe(true);
    expect(highlightsRepository.createHighlight).not.toHaveBeenCalled();
    expect(highlightsRepository.getHighlightById).not.toHaveBeenCalled();
    expect(highlightsRepository.getHighlights).not.toHaveBeenCalled();
    expect(highlightsRepository.getAllUserHighlights).not.toHaveBeenCalled();
  });
});
