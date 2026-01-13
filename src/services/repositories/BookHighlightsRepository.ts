import BookHighlight from '@/types/BookHighlight';
import { turso } from '../database/turso';

class BookHighlightsRepository {
  async createHighlight(bookHighlight: BookHighlight): Promise<void> {
    const { book_hash, created_at, device_code, highlight_text, page } =
      bookHighlight;

    await turso.execute({
      sql: `
      INSERT INTO readit_books_highlights 
      (device_code, highlight_text, book_hash, page, created_at) VALUES 
      (?, ?, ?, ?, ?)
      `,
      args: [device_code, highlight_text, book_hash, page, created_at],
    });
  }

  async deleteHighlight(highlightId: number): Promise<void> {
    await turso.execute({
      sql: `
      DELETE FROM readit_books_highlights 
      WHERE id = ?
      `,
      args: [highlightId],
    });
  }
}

const bookHighlightsRepository = new BookHighlightsRepository();
export default bookHighlightsRepository;
