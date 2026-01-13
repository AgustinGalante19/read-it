'use server';

import BookHighlight from '@/types/BookHighlight';
import { Result } from '@/types/Result';
import bookHighlightsRepository from './repositories/BookHighlightsRepository';
import { revalidatePath } from 'next/cache';

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

export async function deleteBookHighlight(
  highlightId: number
): Promise<Result<string>> {
  try {
    await bookHighlightsRepository.deleteHighlight(highlightId);
    revalidatePath('/book/[slug]');
    return { success: true, data: 'Book highlight deleted successfully' };
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Failed to delete book highlight' };
  }
}
