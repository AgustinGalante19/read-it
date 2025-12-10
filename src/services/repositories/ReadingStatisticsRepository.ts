import { turso } from '../database/turso';

interface ReadingSession {
  duration: number;
  totalPages: number;
  page: number;
  startTime: string;
}

class ReadingStatisticsRepository {
  /**
   * Inserta sesiones de lectura en readit_page_stat_data
   * @param hash - Hash del libro
   * @param sessions - Array de sesiones de lectura
   */
  async saveReadingSessions(
    hash: string,
    sessions: ReadingSession[]
  ): Promise<void> {
    if (!sessions || sessions.length === 0) {
      return;
    }

    for (const session of sessions) {
      // Convertir startTime (ISO string) a timestamp
      const startTimeTimestamp = new Date(session.startTime).getTime();

      // Verificar si ya existe la sesión
      const existing = await turso.execute({
        sql: `SELECT 1 FROM readit_page_stat_data 
              WHERE hash = ? AND start_time = ? AND page = ? 
              LIMIT 1`,
        args: [hash, startTimeTimestamp, session.page],
      });

      if (existing.rows.length > 0) {
        // Actualizar si existe
        await turso.execute({
          sql: `UPDATE readit_page_stat_data 
                SET duration = ?, total_pages = ?
                WHERE hash = ? AND start_time = ? AND page = ?`,
          args: [
            session.duration,
            session.totalPages,
            hash,
            startTimeTimestamp,
            session.page,
          ],
        });
      } else {
        // Insertar si no existe
        await turso.execute({
          sql: `INSERT INTO readit_page_stat_data (hash, page, start_time, duration, total_pages)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            hash,
            session.page,
            startTimeTimestamp,
            session.duration,
            session.totalPages,
          ],
        });
      }
    }
  }

  /**
   * Obtiene las sesiones de lectura de un libro por su hash
   * @param hash - Hash del libro
   * @returns Array de sesiones de lectura
   */
  async getReadingSessionsByHash(hash: string): Promise<ReadingSession[]> {
    const result = await turso.execute({
      sql: `SELECT page, start_time, duration, total_pages 
            FROM readit_page_stat_data 
            WHERE hash = ? 
            ORDER BY start_time DESC`,
      args: [hash],
    });

    return result.rows.map((row) => ({
      page: row.page as number,
      startTime: new Date(Number(row.start_time)).toISOString(),
      duration: row.duration as number,
      totalPages: row.total_pages as number,
    }));
  }
  /**
   * Obtiene las estadísticas diarias de lectura para un usuario
   * @param userEmail - Email del usuario
   * @param filters - Filtros opcionales (mes, año, bookId)
   */
  async getDailyReadingStats(
    userEmail: string,
    filters?: { month?: number; year?: number; bookId?: string }
  ): Promise<
    {
      date: string;
      totalDuration: number;
      booksRead: number;
      details: {
        bookId: string;
        title: string;
        duration: number;
        thumbnail_url?: string;
      }[];
    }[]
  > {
    let query = `
        SELECT 
          date(datetime(psd.start_time / 1000, 'unixepoch')) as reading_date,
          SUM(psd.duration) as total_duration,
          COUNT(DISTINCT b.google_id) as books_read,
          json_group_array(json_object(
            'bookId', b.google_id,
            'title', b.title,
            'duration', psd.duration,
            'thumbnail_url', b.thumbnail_url
          )) as details_json
        FROM readit_page_stat_data psd
        JOIN readit_books b ON psd.hash = b.book_hash
        WHERE b.user_email = ?
      `;

    const args: (string | number)[] = [userEmail];

    if (filters?.year) {
      if (filters.month) {
        const monthStr = filters.month.toString().padStart(2, '0');
        query += ` AND strftime('%Y-%m', datetime(psd.start_time / 1000, 'unixepoch')) = ?`;
        args.push(`${filters.year}-${monthStr}`);
      } else {
        query += ` AND strftime('%Y', datetime(psd.start_time / 1000, 'unixepoch')) = ?`;
        args.push(filters.year.toString());
      }
    }

    if (filters?.bookId) {
      query += ` AND b.google_id = ?`;
      args.push(filters.bookId);
    }

    query += `
        GROUP BY reading_date
        ORDER BY reading_date ASC
      `;

    const result = await turso.execute({
      sql: query,
      args: args,
    });

    return result.rows.map((row) => {
      // Parse details json and aggregate duration per book if multiple sessions existing for same book in same day
      const rawDetails = JSON.parse(row.details_json as string) as {
        bookId: string;
        title: string;
        duration: number;
        thumbnail_url?: string;
      }[];

      // Aggregate sessions by bookId
      const bookMap = new Map<
        string,
        {
          bookId: string;
          title: string;
          duration: number;
          thumbnail_url?: string;
        }
      >();

      rawDetails.forEach((item) => {
        if (bookMap.has(item.bookId)) {
          const existing = bookMap.get(item.bookId)!;
          existing.duration += item.duration;
        } else {
          bookMap.set(item.bookId, { ...item });
        }
      });

      return {
        date: row.reading_date as string,
        totalDuration: Number(row.total_duration),
        booksRead: Number(row.books_read),
        details: Array.from(bookMap.values()),
      };
    });
  }
}

const readingStatisticsRepository = new ReadingStatisticsRepository();

export default readingStatisticsRepository;
