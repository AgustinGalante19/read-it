import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { removeBookThumbnail, uploadBookThumbnail } from '@/services/StorageService';
import { resolveThumbnailUrl } from '@/services/storage/thumbnail-urls';

const hostedBase = 'https://covers.example.test/thumbnails/';
const source = 'http://books.google.com/books/content?id=book';
const fetchMock = vi.fn<typeof fetch>();

describe('self-hosted thumbnails', () => {
  beforeEach(() => {
    vi.stubEnv('THUMBNAIL_BASE_URL', hostedBase);
    vi.stubEnv('THUMBNAIL_WRITE_PASSWORD', 'test-password');
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uploads a cover with server credentials and returns only its storage key', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(new Uint8Array([255, 216, 255]), {
        headers: { 'Content-Type': 'image/jpeg' },
      }))
      .mockResolvedValueOnce(new Response(null, { status: 201 }));

    const cover = await uploadBookThumbnail('book', source);
    expect(cover.key).toMatch(/^books\/uploads\/[a-f0-9-]{36}\.jpg$/);
    expect(cover.url).toBeNull();
    const [upload, options] = fetchMock.mock.calls[1];
    expect(String(upload)).toBe(hostedBase + cover.key);
    expect(options).toMatchObject({
      method: 'PUT',
      redirect: 'error',
      headers: {
        Authorization: 'Basic ' + Buffer.from('readit:test-password').toString('base64'),
        'Content-Type': 'image/jpeg',
      },
    });
  });

  it('only deletes new uploads and treats an already missing upload as deleted', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    await removeBookThumbnail('book', 'book.jpg');
    await removeBookThumbnail('book', 'books/book.jpg');
    await removeBookThumbnail('book', null);
    expect(fetchMock).not.toHaveBeenCalled();

    const key = 'books/uploads/3ee94d41-ded6-4bc2-9b12-b2bb1525a96a.jpg';
    await removeBookThumbnail('book', key);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toBe(hostedBase + key);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
  });

  it('resolves both imported paths and preserves external fallbacks', () => {
    expect(resolveThumbnailUrl('book.jpg', source)).toBe(hostedBase + 'book.jpg');
    expect(resolveThumbnailUrl('books/book.jpg', source)).toBe(hostedBase + 'books/book.jpg');
    expect(resolveThumbnailUrl(null, source)).toBe(source);
    expect(resolveThumbnailUrl('../book.jpg', source)).toBe(source);
    vi.stubEnv('THUMBNAIL_BASE_URL', '');
    expect(resolveThumbnailUrl('book.jpg', source)).toBe(source);
  });
});
