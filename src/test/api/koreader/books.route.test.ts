import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/validateDevice', () => ({
  validateDeviceCode: vi.fn(),
}));

vi.mock('@/services/database/kysely', () => ({
  db: {
    selectFrom: vi.fn(),
  },
}));

import { GET } from '@/app/api/koreader/books/[deviceCode]/route';
import { validateDeviceCode } from '@/lib/validateDevice';
import { db } from '@/services/database/kysely';

const mockedValidate = vi.mocked(validateDeviceCode);
const mockedDb = vi.mocked(db);

describe('GET /api/koreader/books/[deviceCode]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when device invalid', async () => {
    mockedValidate.mockResolvedValue({ valid: false, error: 'Invalid device' });

    const response = await GET(
      {} as any,
      { params: Promise.resolve({ deviceCode: 'd' }) } as any,
    );

    expect(response.status).toBe(401);
  });

  it('returns books list when device valid', async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedDb.selectFrom.mockReturnValue({
      fullJoin: () => ({
        select: () => ({
          where: () => ({
            where: () => ({
              execute: vi.fn().mockResolvedValue([{ id: 1 }]),
            }),
          }),
        }),
      }),
    } as any);

    const response = await GET(
      {} as any,
      { params: Promise.resolve({ deviceCode: 'd' }) } as any,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(1);
  });
});
