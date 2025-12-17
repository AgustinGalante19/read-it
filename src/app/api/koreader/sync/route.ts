import { recordLastReadingInfo } from '@/services/BookService';
import { saveReadingSessions } from '@/services/ReadingStatisticsService';

export async function POST(request: Request) {
  const body = await request.json();

  const {
    lastOpen,
    hash,
    totalReadPages,
    totalReadTime,
    readingSessions,
    deviceCode,
  } = body;

  // Actualizar información general del libro
  await recordLastReadingInfo({
    totalReadPages: totalReadPages,
    totalReadTime: totalReadTime,
    lastOpen: Math.floor(new Date(lastOpen).getTime() / 1000).toString(),
    hash,
    deviceCode,
  });
  console.log(readingSessions);
  // Guardar sesiones de lectura
  if (readingSessions && readingSessions.length > 0) {
    await saveReadingSessions(hash, readingSessions, deviceCode);
  }

  return Response.json({ ok: true });
}
