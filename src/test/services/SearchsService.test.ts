import { describe, it, expect, beforeEach } from 'vitest';
import { bookSearchService } from '@/services/SearchsService';
import 'fake-indexeddb/auto';

describe('SearchsService', () => {
  beforeEach(async () => {
    await bookSearchService.removeIDBBooks();
  });

  it('adds and retrieves recent searches sorted by timestamp desc', async () => {
    const baseBook = {
      google_id: '1',
      title: 'A',
      authors: 'Author',
    } as any;

    await bookSearchService.addIDBBook({ ...baseBook, google_id: '1' });
    await new Promise((r) => setTimeout(r, 5));
    await bookSearchService.addIDBBook({ ...baseBook, google_id: '2' });

    const result = await bookSearchService.getIDBBooks();
    expect(result[0].google_id).toBe('2');
    expect(result[1].google_id).toBe('1');
  });

  it('updates timestamp when adding existing book', async () => {
    const baseBook = {
      google_id: '1',
      title: 'A',
      authors: 'Author',
    } as any;

    await bookSearchService.addIDBBook(baseBook);
    await new Promise((r) => setTimeout(r, 5));
    await bookSearchService.addIDBBook(baseBook);

    const result = await bookSearchService.getIDBBooks();
    expect(result).toHaveLength(1);
    expect(result[0].google_id).toBe('1');
  });

  it('clears recent searches', async () => {
    await bookSearchService.addIDBBook({ google_id: '1' } as any);
    await bookSearchService.removeIDBBooks();

    const result = await bookSearchService.getIDBBooks();
    expect(result).toHaveLength(0);
  });
});
