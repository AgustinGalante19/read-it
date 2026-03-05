import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/validateDevice', () => ({
  validateDeviceCode: vi.fn(),
}));

vi.mock('@/services/BookService', () => ({
  updateBookHash: vi.fn(),
}));

import { POST } from '@/app/api/koreader/hash/route';
import { validateDeviceCode } from '@/lib/validateDevice';
import { updateBookHash } from '@/services/BookService';

const mockedValidate = vi.mocked(validateDeviceCode);
const mockedUpdate = vi.mocked(updateBookHash);

describe('POST /api/koreader/hash', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when device invalid', async () => {
    mockedValidate.mockResolvedValue({ valid: false, error: 'Invalid device' });

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          hash: 'hash',
          googleId: 'g1',
          pageCount: 10,
          deviceCode: 'dev',
        }),
      }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Invalid device');
  });

  it('updates hash when device valid', async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedUpdate.mockResolvedValue({ success: true, data: 'ok' } as any);

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          hash: 'hash',
          googleId: 'g1',
          pageCount: 10,
          deviceCode: 'dev',
        }),
      }),
    );

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('Hash updated successfully');
  });
});
