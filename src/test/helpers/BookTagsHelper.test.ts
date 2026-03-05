import { describe, it, expect } from 'vitest';
import bookTagsHelper from '@/services/helpers/BookTagsHelper';

describe('BookTagsHelper', () => {
  it('normalizes tags splitting by / and trims', () => {
    const result = bookTagsHelper.normalizeBookTags([
      { tags: 'Fiction / Mystery / Thriller' },
      { tags: ' Sci-Fi ' },
      { tags: '' },
    ]);

    expect(result.has('Fiction')).toBe(true);
    expect(result.has('Mystery')).toBe(true);
    expect(result.has('Thriller')).toBe(true);
    expect(result.has('Sci-Fi')).toBe(true);
  });

  it('returns most frequent tag', () => {
    const result = bookTagsHelper.getMostFrequentTag(
      'Mystery / Mystery / Thriller',
    );

    expect(result).toBe('Mystery');
  });

  it('processes tags for radar with normalization', () => {
    const radar = bookTagsHelper.processTagsForRadar([
      { tags: 'Fiction / Mystery & Detective, General', title: '' } as any,
      { tags: 'Science Fiction, Thrillers', title: '' } as any,
      { tags: 'Fiction / Mystery & Detective', title: '' } as any,
    ]);

    const tags = radar.map((item) => item.tag);
    expect(tags).toContain('Mystery & Detective');
    expect(tags).toContain('Science Fiction');
    expect(tags).toContain('Thrillers');
    expect(tags).toContain('General Fiction');
  });
});
