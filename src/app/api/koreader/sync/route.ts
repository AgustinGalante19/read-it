import { recordLastReadingInfo } from '@/services/BookService';
import { saveReadingSessions } from '@/services/ReadingStatisticsService';

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  const { lastOpen, hash, totalReadPages, totalReadTime, readingSessions } =
    body;

  // Actualizar información general del libro
  await recordLastReadingInfo({
    totalReadPages: totalReadPages,
    totalReadTime: totalReadTime,
    lastOpen: new Date(lastOpen).getTime().toString(),
    hash,
  });

  // Guardar sesiones de lectura
  if (readingSessions && readingSessions.length > 0) {
    await saveReadingSessions(hash, readingSessions);
  }

  return Response.json({ ok: true });
}
