import type { NextConfig } from 'next';
import { getThumbnailBaseUrl } from './src/services/storage/thumbnail-urls';

const thumbnailBase = getThumbnailBaseUrl();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'books.google.com' },
      { hostname: 'read-it.site' },
      ...(thumbnailBase ? [new URL('**', thumbnailBase)] : []),
    ],
  },
  experimental: {
    mcpServer: true,
  },
};

export default nextConfig;
