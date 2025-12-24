import { recordLastReadingInfo } from '@/services/BookService';
import { saveReadingSessions } from '@/services/ReadingStatisticsService';
import { validateDeviceCode } from '@/lib/validateDevice';

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

  const validation = await validateDeviceCode(deviceCode);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 401 });
  }

  await recordLastReadingInfo({
    totalReadPages: totalReadPages,
    totalReadTime: totalReadTime,
    lastOpen: Math.floor(new Date(lastOpen).getTime() / 1000).toString(),
    hash,
    deviceCode,
  });

  if (readingSessions && readingSessions.length > 0) {
    await saveReadingSessions(hash, readingSessions, deviceCode);
  }

  return Response.json({ ok: true });
}
