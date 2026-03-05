import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/validateDevice', () => ({
  validateDeviceCode: vi.fn(),
}));

vi.mock('@/services/BookHighlightService', () => ({
  addBookHighlight: vi.fn(),
}));

import { POST } from '@/app/api/koreader/highlights/route';
import { validateDeviceCode } from '@/lib/validateDevice';
import { addBookHighlight } from '@/services/BookHighlightService';

const mockedValidate = vi.mocked(validateDeviceCode);
const mockedAddHighlight = vi.mocked(addBookHighlight);

describe('POST /api/koreader/highlights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when device invalid', async () => {
    mockedValidate.mockResolvedValue({ valid: false, error: 'Invalid device' });

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          book_hash: 'hash',
          created_at: '2024-01-01',
          device_code: 'dev',
          highlight_text: 'Text',
          page: 10,
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it('creates highlight when device valid', async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedAddHighlight.mockResolvedValue({ success: true } as any);

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          book_hash: 'hash',
          created_at: '2024-01-01',
          device_code: 'dev',
          highlight_text: 'Text',
          page: 10,
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
