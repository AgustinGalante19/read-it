'use server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from './storage/s3-client';

const BUCKET_PUBLIC_URL = process.env.NEXT_BUCKET_PUBLIC_URL || 'Invalid URL';
function getExtensionFromContentType(contentType: string | null): string {
  if (!contentType) return 'jpg';

  if (contentType.includes('image/jpeg')) return 'jpg';
  if (contentType.includes('image/png')) return 'png';
  if (contentType.includes('image/webp')) return 'webp';
  if (contentType.includes('image/gif')) return 'gif';
  if (contentType.includes('image/avif')) return 'avif';

  return 'jpg';
}

function getObjectKey(googleId: string, extension: string): string {
  return `books/${googleId}.${extension}`;
}

function buildPublicUrl(bucketPublicUrl: string, objectKey: string): string {
  const normalizedBase = bucketPublicUrl.replace(/\/$/, '');
  return `${normalizedBase}/${objectKey}`;
}

export async function uploadBookThumbnail(
  googleId: string,
  imageUrl: string,
): Promise<string> {
  const normalizedImageUrl = imageUrl.trim();

  if (!normalizedImageUrl) {
    throw new Error('Image URL is required');
  }

  const response = await fetch(normalizedImageUrl);

  if (!response.ok) {
    throw new Error(
      `Could not download thumbnail (${response.status} ${response.statusText})`,
    );
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const extension = getExtensionFromContentType(contentType);
  const objectKey = getObjectKey(googleId, extension);

  const imageBuffer = Buffer.from(await response.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
      Body: imageBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return buildPublicUrl(BUCKET_PUBLIC_URL, objectKey);
}
