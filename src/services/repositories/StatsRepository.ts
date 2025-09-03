import { Book } from '@/types/Book';
import { turso } from '../database/turso';
import BookAdapter from '../adapters/BookAdapter';

class StatsRepository {
  async findBooksByDateRange(
    userEmail: string,
    fromDate: Date,
    toDate: Date,
    status = 3
  ): Promise<Book[]> {
    const result = await turso.execute({
      sql: `SELECT * FROM readit_books 
            WHERE user_email = ?
            AND id_book_status = ?
            AND finish_date BETWEEN ? AND ?
            ORDER BY finish_date DESC`,
      args: [userEmail, status, fromDate.toISOString(), toDate.toISOString()],
    });

    return BookAdapter(result);
  }

  async getTotalPageCount(userEmail: string, status = 3): Promise<number> {
    const { rows } = await turso.execute({
      sql: `SELECT SUM(page_count) as total_pages FROM readit_books WHERE user_email = ? AND id_book_status = ?`,
      args: [userEmail, status],
    });

    return Number(rows[0]?.total_pages) || 0;
  }

  async getBookTags(userEmail: string, status = 3): Promise<string[]> {
    const { rows } = await turso.execute({
      sql: `SELECT tags FROM readit_books WHERE id_book_status = ? AND user_email = ?`,
      args: [status, userEmail],
    });

    return rows.map((row) => String(row.tags));
  }
}

const StatsRepositoryV2 = new StatsRepository();

export default StatsRepositoryV2;
