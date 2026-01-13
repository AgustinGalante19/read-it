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
    sessions: ReadingSession[],
    deviceCode: string
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
              WHERE hash = ? AND start_time = ? AND page = ? AND user_device_code = ?
              LIMIT 1`,
        args: [hash, startTimeTimestamp, session.page, deviceCode],
      });

      if (existing.rows.length > 0) {
        // Actualizar si existe
        await turso.execute({
          sql: `UPDATE readit_page_stat_data 
                SET duration = ?, total_pages = ?
                WHERE hash = ? AND start_time = ? AND page = ? AND user_device_code = ?`,
          args: [
            session.duration,
            session.totalPages,
            hash,
            startTimeTimestamp,
            session.page,
            deviceCode,
          ],
        });
      } else {
        // Insertar si no existe
        await turso.execute({
          sql: `INSERT INTO readit_page_stat_data (hash, page, start_time, duration, total_pages, user_device_code)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [
            hash,
            session.page,
            startTimeTimestamp,
            session.duration,
            session.totalPages,
            deviceCode,
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
  async getReadingSessionsByHash(
    hash: string,
    deviceCode: string
  ): Promise<ReadingSession[]> {
    const result = await turso.execute({
      sql: `SELECT page, start_time, duration, total_pages 
            FROM readit_page_stat_data 
            WHERE hash = ? 
            AND user_device_code = ?
            ORDER BY start_time DESC`,
      args: [hash, deviceCode],
    });

    return result.rows.map((row) => {
      const startTime = Number(row.start_time);
      // If timestamp is less than 10 billion (approx year 2286 in seconds), treat as seconds
      // Otherwise treat as milliseconds
      const date = new Date(
        startTime < 10000000000 ? startTime * 1000 : startTime
      );

      return {
        page: row.page as number,
        startTime: date.toISOString(),
        duration: row.duration as number,
        totalPages: row.total_pages as number,
      };
    });
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
        start_date: string;
        duration: number;
        thumbnail_url?: string;
      }[];
    }[]
  > {
    let query = `
        SELECT 
          date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) as reading_date,
          SUM(psd.duration) as total_duration,
          COUNT(DISTINCT b.google_id) as books_read,
          json_group_array(json_object(
            'bookId', b.google_id,
            'title', b.title,
            'start_date', b.start_date,
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
        query += ` AND strftime('%Y-%m', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) = ?`;
        args.push(`${filters.year}-${monthStr}`);
      } else {
        query += ` AND strftime('%Y', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) = ?`;
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
        start_date: string;
        duration: number;
        thumbnail_url?: string;
      }[];

      // Aggregate sessions by bookId
      const bookMap = new Map<
        string,
        {
          bookId: string;
          title: string;
          start_date: string;
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

  async getTotalReadTimeByHash(
    hash: string,
    userEmail: string
  ): Promise<number> {
    const result = await turso.execute({
      sql: `
            SELECT SUM(duration) as total_duration 
            FROM readit_page_stat_data 
            WHERE hash = ? 
            AND user_device_code = (
              SELECT device_code 
              FROM readit_user_devices 
              WHERE user_email = ?
            )
            `,
      args: [hash, userEmail],
    });

    if (result.rows.length === 0 || !result.rows[0].total_duration) {
      return 0;
    }

    return Number(result.rows[0].total_duration);
  }

  async getAggregatedStats(userEmail: string): Promise<{
    week: { pages: number; duration: number };
    month: { pages: number; duration: number };
  }> {
    const result = await turso.execute({
      sql: `
        SELECT 
          COUNT(CASE WHEN date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) >= date('now', '-7 days') THEN 1 END) as week_pages,
          SUM(CASE WHEN date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) >= date('now', '-7 days') THEN psd.duration ELSE 0 END) as week_duration,
          COUNT(CASE WHEN strftime('%Y-%m', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) = strftime('%Y-%m', 'now') THEN 1 END) as month_pages,
          SUM(CASE WHEN strftime('%Y-%m', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) = strftime('%Y-%m', 'now') THEN psd.duration ELSE 0 END) as month_duration
        FROM readit_page_stat_data psd
        JOIN readit_books b ON psd.hash = b.book_hash
        WHERE b.user_email = ?
      `,
      args: [userEmail],
    });

    const row = result.rows[0];
    return {
      week: {
        pages: Number(row.week_pages) || 0,
        duration: Number(row.week_duration) || 0,
      },
      month: {
        pages: Number(row.month_pages) || 0,
        duration: Number(row.month_duration) || 0,
      },
    };
  }

  async getLast30DaysDailyStats(
    userEmail: string
  ): Promise<{ date: string; pages: number; duration: number }[]> {
    const result = await turso.execute({
      sql: `
        SELECT 
          date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) as reading_date,
          COUNT(*) as pages,
          SUM(psd.duration) as duration
        FROM readit_page_stat_data psd
        JOIN readit_books b ON psd.hash = b.book_hash
        WHERE b.user_email = ? 
        AND reading_date >= date('now', '-30 days')
        GROUP BY reading_date
        ORDER BY reading_date ASC
      `,
      args: [userEmail],
    });

    return result.rows.map((row) => ({
      date: row.reading_date as string,
      pages: Number(row.pages),
      duration: Number(row.duration),
    }));
  }

  async getHourlyStats(
    userEmail: string,
    timezoneOffsetMinutes?: number
  ): Promise<{ hour: number; pages: number; duration: number }[]> {
    // If no timezone offset provided, use UTC (0)
    const offsetMinutes = timezoneOffsetMinutes ?? 0;
    const offsetSeconds = offsetMinutes * 60;

    const result = await turso.execute({
      sql: `
          SELECT 
            strftime('%H', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch', ? || ' seconds')) as reading_hour,
            COUNT(*) as pages,
            SUM(psd.duration) as duration
          FROM readit_page_stat_data psd
          JOIN readit_books b ON psd.hash = b.book_hash
          WHERE b.user_email = ?
          GROUP BY reading_hour
          ORDER BY reading_hour ASC
        `,
      args: [offsetSeconds.toString(), userEmail],
    });

    // Initialize array with all 24 hours
    const hoursMap = new Map<
      number,
      { hour: number; pages: number; duration: number }
    >();
    for (let i = 0; i < 24; i++) {
      hoursMap.set(i, { hour: i, pages: 0, duration: 0 });
    }

    result.rows.forEach((row) => {
      const hour = Number(row.reading_hour);
      if (hoursMap.has(hour)) {
        hoursMap.set(hour, {
          hour,
          pages: Number(row.pages),
          duration: Number(row.duration),
        });
      }
    });

    return Array.from(hoursMap.values());
  }

  async getLastSyncDate(
    userEmail: string,
    book_hash: string
  ): Promise<string | null> {
    const { rows } = await turso.execute({
      sql: `
      SELECT rpsd.start_time, rpsd.id, rpsd.hash, rpsd.page FROM readit_page_stat_data  rpsd
      JOIN readit_user_devices rud on rud.device_code = rpsd.user_device_code
      WHERE hash = ?
      AND rud.user_email = ?
      ORDER BY rpsd.id DESC LIMIT 1`,
      args: [book_hash, userEmail],
    });

    if (rows.length === 0 || !rows[0].start_time) {
      return null;
    }

    const startTime = Number(rows[0].start_time);
    // Si el timestamp es menor a 10 billones, tratarlo como segundos, sino como milisegundos
    const date = new Date(
      startTime < 10000000000 ? startTime * 1000 : startTime
    );
    return date.toISOString();
  }

  /**
   * Elimina todas las estadísticas de lectura de un libro identificado por google_id
   * @param googleId - ID de Google del libro
   * @param userEmail - Email del usuario
   * @returns Promise<void>
   */
  async deleteReadingStatsByGoogleId(
    googleId: string,
    userEmail: string
  ): Promise<void> {
    await turso.execute({
      sql: `
        DELETE FROM readit_page_stat_data
        WHERE hash IN (
          SELECT book_hash 
          FROM readit_books 
          WHERE google_id = ? AND user_email = ?
        )
      `,
      args: [googleId, userEmail],
    });
  }
}

const readingStatisticsRepository = new ReadingStatisticsRepository();

export default readingStatisticsRepository;
