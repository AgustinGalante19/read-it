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
}

const readingStatisticsRepository = new ReadingStatisticsRepository();

export default readingStatisticsRepository;
