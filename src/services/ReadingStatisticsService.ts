'use server';

import { Result } from '@/types/Result';
import readingStatisticsRepository from './repositories/ReadingStatisticsRepository';

interface ReadingSession {
  duration: number;
  totalPages: number;
  page: number;
  startTime: string;
}

/**
 * Guarda las sesiones de lectura de un libro
 * @param hash - Hash del libro
 * @param sessions - Array de sesiones de lectura
 */
export async function saveReadingSessions(
  hash: string,
  sessions: ReadingSession[]
): Promise<Result<string>> {
  try {
    await readingStatisticsRepository.saveReadingSessions(hash, sessions);
    return {
      success: true,
      data: `${sessions.length} reading sessions saved successfully`,
    };
  } catch (error) {
    console.error('Error saving reading sessions:', error);
    return { success: false, error: 'Failed to save reading sessions' };
  }
}

/**
 * Obtiene las sesiones de lectura de un libro por su hash
 * @param hash - Hash del libro
 */
export async function getReadingSessionsByHash(
  hash: string
): Promise<Result<ReadingSession[]>> {
  try {
    const sessions = await readingStatisticsRepository.getReadingSessionsByHash(
      hash
    );
    return { success: true, data: sessions };
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    return { success: false, error: 'Failed to fetch reading sessions' };
  }
}
