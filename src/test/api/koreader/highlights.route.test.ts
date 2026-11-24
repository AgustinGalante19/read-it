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
          created_at: '2026-10-19T11:50:06Z',
          device_code: 'dev',
          highlight_text: 'Text',
          page: 10,
        }),
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(mockedAddHighlight).toHaveBeenCalledWith({
      book_hash: 'hash',
      created_at: new Date('2026-10-19T11:50:06Z'),
      device_code: 'dev',
      highlight_text: 'Text',
      id: 0,
      page: 10,
      isNote: false,
    });
  });

  it('returns 500 when saving the highlight fails', async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedAddHighlight.mockResolvedValue({
      success: false,
      error: 'Failed to add book highlight',
    });

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          book_hash: 'hash',
          created_at: '2026-10-19T11:50:06Z',
          device_code: 'dev',
          highlight_text: 'Text',
          page: 10,
        }),
      }),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: 'Failed to add book highlight',
    });
  });

  it('returns 404 when the book is not linked and ignores client-provided ownership', async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedAddHighlight.mockResolvedValue({ success: false, error: 'Book not linked to this device', status: 404 });
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ book_hash: 'unknown', device_code: 'dev', created_at: '2026-11-24T10:00:00Z',
        page: 10, highlight_text: 'Text', isNote: true, google_id: 'forged', user_email: 'forged' }),
    }));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ success: false, error: 'Book not linked to this device' });
    expect(mockedAddHighlight).toHaveBeenCalledWith(expect.not.objectContaining({ is_note: expect.anything() }));
    expect(mockedAddHighlight).toHaveBeenCalledWith(expect.not.objectContaining({ google_id: expect.anything() }));
    expect(mockedAddHighlight).toHaveBeenCalledWith(expect.not.objectContaining({ user_email: expect.anything() }));
    expect(mockedAddHighlight).toHaveBeenCalledWith(expect.objectContaining({ book_hash: 'unknown', isNote: true }));
  });

  it.each([true, false])('accepts isNote=%s while keeping the hash-based request format', async (isNote) => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedAddHighlight.mockResolvedValue({ success: true });
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ book_hash: 'hash', device_code: 'dev', created_at: '2026-11-24T10:00:00Z',
        page: 10, highlight_text: 'Text', isNote }),
    }));
    expect(response.status).toBe(200);
    expect(mockedAddHighlight).toHaveBeenCalledWith(expect.objectContaining({ book_hash: 'hash', isNote }));
  });

  it.each(['true', 'false', null, 0, 1, {}, []])('returns 400 for non-boolean isNote=%j without saving', async (isNote) => {
    mockedValidate.mockResolvedValue({ valid: true });
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ book_hash: 'hash', device_code: 'dev', created_at: '2026-11-24T10:00:00Z',
        page: 10, highlight_text: 'Text', isNote }),
    }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ success: false, error: 'isNote must be a boolean' });
    expect(mockedAddHighlight).not.toHaveBeenCalled();
  });

  it.each(['not-a-date', '', null, undefined, 0, true, {}, []])(
    'returns 400 for invalid created_at %j',
    async (created_at) => {
      mockedValidate.mockResolvedValue({ valid: true });

      const response = await POST(
        new Request('http://localhost', {
          method: 'POST',
          body: JSON.stringify({
            book_hash: 'hash',
            created_at,
            device_code: 'dev',
            highlight_text: 'Text',
            page: 10,
          }),
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        success: false,
        error: 'Invalid created_at date',
      });
      expect(mockedAddHighlight).not.toHaveBeenCalled();
    },
  );
});
