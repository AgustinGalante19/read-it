import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BookHighlightInput } from '@/types/BookHighlight';
import bookHighlightsRepository from '@/services/repositories/BookHighlightsRepository';

const { insertInto, values, execute } = vi.hoisted(() => ({
  insertInto: vi.fn(),
  values: vi.fn(),
  execute: vi.fn(),
}));

vi.mock('@/services/database/kysely', () => ({
  db: { insertInto },
}));

const highlight = {
  id: 0,
  book_hash: 'hash',
  device_code: 'dev',
  highlight_text: 'Turno de noche. No se movía ni un alma.',
  page: 403,
};

describe('BookHighlightsRepository.createHighlight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    insertInto.mockReturnValue({ values });
    values.mockReturnValue({ execute });
    execute.mockResolvedValue([]);
  });

  it.each([
    '2026-10-19T11:50:06Z',
    new Date('2026-10-19T11:50:06Z'),
    '2026-10-19T08:50:06-03:00',
  ])('persists the same UTC instant for %s', async (created_at) => {
    await bookHighlightsRepository.createHighlight({ ...highlight, created_at });

    expect(values).toHaveBeenCalledWith({
      book_hash: 'hash',
      device_code: 'dev',
      highlight_text: highlight.highlight_text,
      page: '403',
      created_at: '2026-10-19T11:50:06.000Z',
    });
    expect(execute).toHaveBeenCalledOnce();
  });

  it.each(['invalid', '', new Date(NaN), null, undefined, 0, true, {}, []])(
    'rejects invalid date %j before writing to the database',
    async (created_at) => {
      await expect(
        bookHighlightsRepository.createHighlight({
          ...highlight,
          created_at,
        } as BookHighlightInput),
      ).rejects.toThrow('Invalid created_at date');
      expect(insertInto).not.toHaveBeenCalled();
    },
  );
});
