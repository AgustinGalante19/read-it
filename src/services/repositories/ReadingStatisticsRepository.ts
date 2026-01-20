import { Book } from '@/types/Book';
import BookAdapter from '../adapters/BookAdapter';
import { db } from '../database/kysely';
import { sql } from 'kysely';

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
    deviceCode: string,
  ): Promise<void> {
    if (!sessions || sessions.length === 0) {
      return;
    }

    for (const session of sessions) {
      const startTimeTimestamp = new Date(session.startTime).getTime();

      // Verificar si ya existe la sesión
      const existing = await db
        .selectFrom('readit_page_stat_data')
        .select('id')
        .where('hash', '=', hash)
        .where('start_time', '=', startTimeTimestamp)
        .where('page', '=', session.page)
        .where('user_device_code', '=', deviceCode)
        .execute();

      if (existing.length > 0) {
        // Actualizar si existe
        await db
          .updateTable('readit_page_stat_data')
          .set({
            duration: session.duration,
            total_pages: session.totalPages,
          })
          .where('hash', '=', hash)
          .where('start_time', '=', startTimeTimestamp)
          .where('page', '=', session.page)
          .where('user_device_code', '=', deviceCode)
          .execute();
      } else {
        // Insertar si no existe
        await db
          .insertInto('readit_page_stat_data')
          .values({
            hash,
            page: session.page,
            start_time: startTimeTimestamp,
            duration: session.duration,
            total_pages: session.totalPages,
            user_device_code: deviceCode,
          })
          .execute();
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
    deviceCode: string,
  ): Promise<ReadingSession[]> {
    const result = await db
      .selectFrom('readit_page_stat_data')
      .select(['page', 'start_time', 'duration', 'total_pages'])
      .where('hash', '=', hash)
      .where('user_device_code', '=', deviceCode)
      .orderBy('start_time', 'desc')
      .execute();

    return result.map((row) => {
      const startTime = Number(row.start_time);
      // If timestamp is less than 10 billion (approx year 2286 in seconds), treat as seconds
      // Otherwise treat as milliseconds
      const date = new Date(
        startTime < 10000000000 ? startTime * 1000 : startTime,
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
    filters?: { month?: number; year?: number; bookId?: string },
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
    let query = db
      .selectFrom('readit_page_stat_data as psd')
      .innerJoin('readit_books as b', 'psd.hash', 'b.book_hash')
      .select([
        sql<string>`date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch'))`.as(
          'reading_date',
        ),
        sql<number>`SUM(psd.duration)`.as('total_duration'),
        sql<number>`COUNT(DISTINCT b.google_id)`.as('books_read'),
        sql<string>`json_group_array(json_object(
          'bookId', b.google_id,
          'title', b.title,
          'start_date', b.start_date,
          'duration', psd.duration,
          'thumbnail_url', b.thumbnail_url
        ))`.as('details_json'),
      ])
      .where('b.user_email', '=', userEmail);

    if (filters?.year) {
      if (filters.month) {
        const monthStr = filters.month.toString().padStart(2, '0');
        query = query.where(
          sql`strftime('%Y-%m', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch'))`,
          '=',
          `${filters.year}-${monthStr}`,
        );
      } else {
        query = query.where(
          sql`strftime('%Y', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch'))`,
          '=',
          filters.year.toString(),
        );
      }
    }

    if (filters?.bookId) {
      query = query.where('b.google_id', '=', filters.bookId);
    }

    const result = await query
      .groupBy(sql`reading_date`)
      .orderBy('reading_date', 'asc')
      .execute();

    return result.map((row) => {
      // Parse details json and aggregate duration per book if multiple sessions existing for same book in same day
      const rawDetails = JSON.parse(row.details_json) as {
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
        date: row.reading_date,
        totalDuration: Number(row.total_duration),
        booksRead: Number(row.books_read),
        details: Array.from(bookMap.values()),
      };
    });
  }

  async getTotalReadTimeByHash(
    hash: string,
    userEmail: string,
  ): Promise<number> {
    const result = await db
      .selectFrom('readit_page_stat_data as psd')
      .select(sql<number>`SUM(duration)`.as('total_duration'))
      .where('psd.hash', '=', hash)
      .where('psd.user_device_code', 'in', (qb) =>
        qb
          .selectFrom('readit_user_devices')
          .select('device_code')
          .where('user_email', '=', userEmail),
      )
      .executeTakeFirst();

    if (!result || !result.total_duration) {
      return 0;
    }

    return Number(result.total_duration);
  }

  async getAggregatedStats(userEmail: string): Promise<{
    week: { pages: number; duration: number };
    month: { pages: number; duration: number };
  }> {
    const result = await db
      .selectFrom('readit_page_stat_data as psd')
      .innerJoin('readit_books as b', 'psd.hash', 'b.book_hash')
      .select([
        sql<number>`COUNT(CASE WHEN date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) >= date('now', '-7 days') THEN 1 END)`.as(
          'week_pages',
        ),
        sql<number>`SUM(CASE WHEN date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) >= date('now', '-7 days') THEN psd.duration ELSE 0 END)`.as(
          'week_duration',
        ),
        sql<number>`COUNT(CASE WHEN strftime('%Y-%m', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) = strftime('%Y-%m', 'now') THEN 1 END)`.as(
          'month_pages',
        ),
        sql<number>`SUM(CASE WHEN strftime('%Y-%m', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch')) = strftime('%Y-%m', 'now') THEN psd.duration ELSE 0 END)`.as(
          'month_duration',
        ),
      ])
      .where('b.user_email', '=', userEmail)
      .executeTakeFirst();

    if (!result) {
      return {
        week: { pages: 0, duration: 0 },
        month: { pages: 0, duration: 0 },
      };
    }

    return {
      week: {
        pages: Number(result.week_pages) || 0,
        duration: Number(result.week_duration) || 0,
      },
      month: {
        pages: Number(result.month_pages) || 0,
        duration: Number(result.month_duration) || 0,
      },
    };
  }

  async getLast30DaysDailyStats(
    userEmail: string,
  ): Promise<{ date: string; pages: number; duration: number }[]> {
    const result = await db
      .selectFrom('readit_page_stat_data as psd')
      .innerJoin('readit_books as b', 'psd.hash', 'b.book_hash')
      .select([
        sql<string>`date(datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch'))`.as(
          'reading_date',
        ),
        sql<number>`COUNT(*)`.as('pages'),
        sql<number>`SUM(psd.duration)`.as('duration'),
      ])
      .where('b.user_email', '=', userEmail)
      .where(sql`reading_date`, '>=', sql`date('now', '-30 days')`)
      .groupBy(sql`reading_date`)
      .orderBy('reading_date', 'asc')
      .execute();

    return result.map((row) => ({
      date: row.reading_date,
      pages: Number(row.pages),
      duration: Number(row.duration),
    }));
  }

  async getHourlyStats(
    userEmail: string,
    timezoneOffsetMinutes?: number,
  ): Promise<{ hour: number; pages: number; duration: number }[]> {
    // If no timezone offset provided, use UTC (0)
    const offsetMinutes = timezoneOffsetMinutes ?? 0;
    const offsetSeconds = offsetMinutes * 60;

    const result = await db
      .selectFrom('readit_page_stat_data as psd')
      .innerJoin('readit_books as b', 'psd.hash', 'b.book_hash')
      .select([
        sql<string>`strftime('%H', datetime(CASE WHEN psd.start_time < 10000000000 THEN psd.start_time ELSE psd.start_time / 1000 END, 'unixepoch', ${sql.lit(offsetSeconds.toString())} || ' seconds'))`.as(
          'reading_hour',
        ),
        sql<number>`COUNT(*)`.as('pages'),
        sql<number>`SUM(psd.duration)`.as('duration'),
      ])
      .where('b.user_email', '=', userEmail)
      .groupBy(sql`reading_hour`)
      .orderBy('reading_hour', 'asc')
      .execute();

    // Initialize array with all 24 hours
    const hoursMap = new Map<
      number,
      { hour: number; pages: number; duration: number }
    >();
    for (let i = 0; i < 24; i++) {
      hoursMap.set(i, { hour: i, pages: 0, duration: 0 });
    }

    result.forEach((row) => {
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
    book_hash: string,
  ): Promise<string | null> {
    const result = await db
      .selectFrom('readit_page_stat_data as rpsd')
      .innerJoin(
        'readit_user_devices as rud',
        'rud.device_code',
        'rpsd.user_device_code',
      )
      .select(['rpsd.start_time', 'rpsd.id', 'rpsd.hash', 'rpsd.page'])
      .where('rpsd.hash', '=', book_hash)
      .where('rud.user_email', '=', userEmail)
      .orderBy('rpsd.id', 'desc')
      .limit(1)
      .executeTakeFirst();

    if (!result || !result.start_time) {
      return null;
    }

    const startTime = Number(result.start_time);
    // Si el timestamp es menor a 10 billones, tratarlo como segundos, sino como milisegundos
    const date = new Date(
      startTime < 10000000000 ? startTime * 1000 : startTime,
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
    userEmail: string,
  ): Promise<void> {
    await db
      .deleteFrom('readit_page_stat_data')
      .where('hash', 'in', (qb) =>
        qb
          .selectFrom('readit_books')
          .select('book_hash')
          .where('google_id', '=', googleId)
          .where('user_email', '=', userEmail),
      )
      .execute();
  }

  async findBooksByDateRange(
    userEmail: string,
    fromDate: Date,
    toDate: Date,
    status = 3,
  ): Promise<Book[]> {
    const result = await db
      .selectFrom('readit_books')
      .selectAll()
      .where('user_email', '=', userEmail)
      .where('id_book_status', '=', status)
      .where('finish_date', '>=', fromDate.toISOString())
      .where('finish_date', '<=', toDate.toISOString())
      .orderBy('finish_date', 'desc')
      .execute();

    return BookAdapter(result);
  }

  async getTotalPageCount(userEmail: string, status = 3): Promise<number> {
    const result = await db
      .selectFrom('readit_books')
      .select(db.fn.sum('page_count').as('total_pages'))
      .where('user_email', '=', userEmail)
      .where('id_book_status', '=', status)
      .executeTakeFirst();

    return Number(result?.total_pages) ?? 0;
  }

  async getBookTags(userEmail: string, status = 3): Promise<string[]> {
    const tagsList = await db
      .selectFrom('readit_books')
      .select('tags')
      .where('user_email', '=', userEmail)
      .where('id_book_status', '=', status)
      .execute();

    return tagsList.map((row) => String(row.tags));
  }
}

const readingStatisticsRepository = new ReadingStatisticsRepository();

export default readingStatisticsRepository;
