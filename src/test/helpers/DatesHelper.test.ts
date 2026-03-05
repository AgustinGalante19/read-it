import { describe, it, expect } from 'vitest';
import datesHelper from '@/services/helpers/DatesHelper';

describe('DatesHelper', () => {
  it('formats known date formats', () => {
    const formatted = datesHelper.formatDate('2024-01-05');
    expect(formatted).toContain('05');
    expect(formatted).toContain('2024');
  });

  it('returns Not Provided for undefined date', () => {
    expect(datesHelper.getDateString(undefined)).toBe('Not Provided');
  });

  it('parses local date string', () => {
    const parsed = datesHelper.parseLocalDate('2024-02-10');
    expect(parsed?.getFullYear()).toBe(2024);
    expect(parsed?.getMonth()).toBe(1);
    expect(parsed?.getDate()).toBe(10);
  });

  it('formats seconds to duration', () => {
    expect(datesHelper.formatSecondsToDuration(45)).toBe('0m');
    expect(datesHelper.formatSecondsToDuration(3600)).toBe('1h 0m');
    expect(datesHelper.formatSecondsToDuration(3720)).toBe('1h 2m');
  });
});
