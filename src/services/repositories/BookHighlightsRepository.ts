import BookHighlight, { BookHighlightPreview } from '@/types/BookHighlight';
import { db } from '../database/kysely';
import { highlightAdapter } from '../adapters/BookAdapter';

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

  async getHighlights(
    googleId: string,
    userEmail: string,
  ): Promise<BookHighlightPreview[]> {
    const result = await db
      .selectFrom('readit_books as rb')
      .innerJoin(
        'readit_books_highlights as rbh',
        'rb.book_hash',
        'rbh.book_hash',
      )
      .select([
        'rb.id as book_id',
        'rbh.id as highlight_id',
        'rb.title',
        'rb.authors',
        'rbh.highlight_text',
        'rbh.page',
        'rbh.created_at',
      ])
      .where('rb.google_id', '=', googleId)
      .where('rb.user_email', '=', userEmail)
      .orderBy('rbh.created_at', 'asc')
      .execute();
    return highlightAdapter(result);
  }
}

const bookHighlightsRepository = new BookHighlightsRepository();
export default bookHighlightsRepository;
