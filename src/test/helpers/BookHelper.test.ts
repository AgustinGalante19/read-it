import { describe, it, expect } from 'vitest';
import bookHelper from '@/services/helpers/BookHelper';
import { BookStatus } from '@/types/Book';

describe('BookHelper', () => {
  it('formats authors', () => {
    expect(bookHelper.getBookAuthors(undefined)).toBe('Not Provided');
    expect(bookHelper.getBookAuthors(['A', 'B'])).toBe('A B');
    expect(bookHelper.getBookAuthors('Single Author')).toBe('Single Author');
  });

  it('filters books by status and sorts read by finish_date desc', () => {
    const books = [
      { id_book_status: 3, finish_date: '2024-01-02' },
      { id_book_status: 3, finish_date: '2024-02-01' },
      { id_book_status: 2 },
      { id_book_status: 1 },
    ] as any[];

    const read = bookHelper.filterBooksByStatus(books, BookStatus.READ);
    expect(read).toHaveLength(2);
    expect(read[0].finish_date).toBe('2024-02-01');

    const reading = bookHelper.filterBooksByStatus(books, BookStatus.READING);
    expect(reading).toHaveLength(1);
    expect(reading[0].id_book_status).toBe(2);
  });
});
