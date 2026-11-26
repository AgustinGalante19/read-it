import { randomUUID } from 'node:crypto';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import s3 from './storage/s3-client';
import { getThumbnailBaseUrl } from './storage/thumbnail-urls';

const BUCKET_PUBLIC_URL = process.env.NEXT_BUCKET_PUBLIC_URL || 'Invalid URL';
const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;
const providerHosts = new Set(['books.google.com', 'books.googleusercontent.com', 'covers.openlibrary.org']);
const imageExtensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
]);
const newThumbnailKey = /^books\/uploads\/[a-f0-9-]{36}\.(?:jpg|png|webp|gif|avif)$/;

function getObjectKey(googleId: string, extension: string): string {
  return `books/${googleId}.${extension}`;
}

function buildPublicUrl(bucketPublicUrl: string, objectKey: string): string {
  const normalizedBase = bucketPublicUrl.replace(/\/$/, '');
  return `${normalizedBase}/${objectKey}`;
}

async function writeHostedThumbnail(
  base: URL,
  key: string,
  method: 'PUT' | 'DELETE',
  image?: { body: ArrayBuffer; contentType: string },
): Promise<void> {
  const password = process.env.THUMBNAIL_WRITE_PASSWORD;
  if (!password) throw new Error('THUMBNAIL_WRITE_PASSWORD is required');

  const response = await fetch(new URL(key, base), {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`readit:${password}`).toString('base64')}`,
      ...(image ? { 'Content-Type': image.contentType } : {}),
    },
    body: image?.body,
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok && !(method === 'DELETE' && response.status === 404)) {
    throw new Error(`Thumbnail ${method} failed with status ${response.status}`);
  }
}

export async function uploadBookThumbnail(
  googleId: string,
  imageUrl: string,
): Promise<{ key: string | null; url: string | null }> {
  const source = new URL(imageUrl);
  if (!providerHosts.has(source.hostname) || source.username || source.password || source.port ||
      (source.protocol !== 'http:' && source.protocol !== 'https:')) {
    throw new Error('Unsupported thumbnail source');
  }
  source.protocol = 'https:';

  const response = await fetch(source, {
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(
      `Could not download thumbnail (${response.status} ${response.statusText})`,
    );
  }

  const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ?? '';
  const extension = imageExtensions.get(contentType);
  if (!extension) throw new Error('Unsupported thumbnail content type');
  if (Number(response.headers.get('content-length')) > MAX_THUMBNAIL_BYTES) {
    throw new Error('Thumbnail is too large');
  }

  const body = await response.arrayBuffer();
  if (!body.byteLength || body.byteLength > MAX_THUMBNAIL_BYTES) {
    throw new Error('Invalid thumbnail size');
  }

  const base = getThumbnailBaseUrl();
  if (base) {
    const key = `books/uploads/${randomUUID()}.${extension}`;
    await writeHostedThumbnail(base, key, 'PUT', { body, contentType });
    return { key, url: null };
  }

  const objectKey = getObjectKey(googleId, extension);
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
      Body: Buffer.from(body),
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return { key: null, url: buildPublicUrl(BUCKET_PUBLIC_URL, objectKey) };
}

export async function removeBookThumbnail(googleId: string, key: string | null): Promise<void> {
  const base = getThumbnailBaseUrl();
  if (base || key) {
    // Imported covers can be shared across accounts. Only new uploads are owned by one row.
    if (base && key && newThumbnailKey.test(key)) await writeHostedThumbnail(base, key, 'DELETE');
    return;
  }
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: `books/${googleId}.jpg`,
    }),
  );
}

export async function checkIfThumbnailExists(
  googleId: string,
): Promise<string | null> {
  const possibleExtensions = ['jpg', 'jpeg'];
  for (const ext of possibleExtensions) {
    const objectKey = getObjectKey(googleId, ext);
    try {
      await s3.send(
        new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME!,
          Key: objectKey,
        }),
      );
      return buildPublicUrl(BUCKET_PUBLIC_URL, objectKey);
    } catch {
      return null;
    }
  }
  return null;
}
