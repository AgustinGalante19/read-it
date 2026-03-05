import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/validateDevice', () => ({
  validateDeviceCode: vi.fn(),
}));

vi.mock('@/services/BookService', () => ({
  recordLastReadingInfo: vi.fn(),
}));

vi.mock('@/services/ReadingStatisticsService', () => ({
  saveReadingSessions: vi.fn(),
}));

import { POST } from '@/app/api/koreader/sync/route';
import { validateDeviceCode } from '@/lib/validateDevice';
import { recordLastReadingInfo } from '@/services/BookService';
import { saveReadingSessions } from '@/services/ReadingStatisticsService';

const mockedValidate = vi.mocked(validateDeviceCode);
const mockedRecord = vi.mocked(recordLastReadingInfo);
const mockedSaveSessions = vi.mocked(saveReadingSessions);

describe('POST /api/koreader/sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when device invalid', async () => {
    mockedValidate.mockResolvedValue({ valid: false, error: 'Invalid device' });

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          lastOpen: '2024-01-01T10:00:00Z',
          hash: 'hash',
          totalReadPages: 10,
          totalReadTime: 100,
          readingSessions: [],
          deviceCode: 'dev',
        }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it('records last reading and saves sessions', async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedRecord.mockResolvedValue({ success: true } as any);
    mockedSaveSessions.mockResolvedValue({ success: true } as any);

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          lastOpen: '2024-01-01T10:00:00Z',
          hash: 'hash',
          totalReadPages: 10,
          totalReadTime: 100,
          readingSessions: [{
            duration: 30,
            totalPages: 10,
            page: 10,
            startTime: '2024-01-01T10:00:00Z',
          }],
          deviceCode: 'dev',
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
  });
});
