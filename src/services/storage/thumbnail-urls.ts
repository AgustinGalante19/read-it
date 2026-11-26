export function getThumbnailBaseUrl(): URL | null {
  const value = process.env.THUMBNAIL_BASE_URL?.trim();
  if (!value) return null;

  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('THUMBNAIL_BASE_URL must be an HTTPS directory URL');
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url;
}

const thumbnailKeyPattern = /^(?:books\/(?:uploads\/)?)?[A-Za-z0-9_-]+\.(?:jpg|jpeg|png|webp|gif|avif)$/;

export function resolveThumbnailUrl(
  key: string | null | undefined,
  fallback: string | null | undefined,
): string | null {
  const base = key && thumbnailKeyPattern.test(key) ? getThumbnailBaseUrl() : null;
  return base && key ? new URL(key, base).href : fallback ?? null;
}
