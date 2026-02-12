import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'books.google.com' },
      { hostname: 'read-it.site' },
    ],
  },
  experimental: {
    mcpServer: true,
  },
};

export default nextConfig;
