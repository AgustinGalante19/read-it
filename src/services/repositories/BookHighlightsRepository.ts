import BookHighlight from '@/types/BookHighlight';
import { db } from '../database/kysely';

class BookHighlightsRepository {
  async createHighlight(bookHighlight: BookHighlight): Promise<void> {
    const { book_hash, created_at, device_code, highlight_text, page } =
      bookHighlight;

    await db
      .insertInto('readit_books_highlights')
      .values({
        device_code,
        highlight_text,
        book_hash,
        page: page.toString(),
        created_at: created_at.toISOString(),
      })
      .execute();
  }

  async deleteHighlight(highlightId: number): Promise<void> {
    await db
      .deleteFrom('readit_books_highlights')
      .where('id', '=', highlightId)
      .execute();
  }
}

const bookHighlightsRepository = new BookHighlightsRepository();
export default bookHighlightsRepository;
