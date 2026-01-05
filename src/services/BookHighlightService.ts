'use server';

import BookHighlight from '@/types/BookHighlight';
import { Result } from '@/types/Result';
import bookHighlightsRepository from './repositories/BookHighlightsRepository';

export async function addBookHighlight(
  highlightData: BookHighlight
): Promise<Result<string>> {
  try {
    await bookHighlightsRepository.createHighlight(highlightData);
    return { success: true, data: 'Book highlight added successfully' };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Failed to add book highlight' };
  }
}
