import { describe, it, expect } from 'vitest';
import ReadDatesHelper from '@/services/helpers/ReadDatesHelper';
import { BookStatus } from '@/types/Book';

describe('ReadDatesHelper', () => {
  it('sets start date when switching to READING', () => {
    const result = ReadDatesHelper(BookStatus.READING, null);
    expect(result.startDate).toBeDefined();
    expect(result.finishDate).toBeUndefined();
  });

  it('sets finish date for READ and preserves existing start', () => {
    const result = ReadDatesHelper(BookStatus.READ, { start_date: '2024-01-01' });
    expect(result.finishDate).toBeDefined();
    expect(result.startDate).toBeUndefined();
  });

  it('sets both dates for READ when no start exists', () => {
    const result = ReadDatesHelper(BookStatus.READ, null);
    expect(result.startDate).toBeDefined();
    expect(result.finishDate).toBeDefined();
  });
});
