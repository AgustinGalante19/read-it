import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'books.google.com' }],
  },
  experimental: {
    mcpServer: true,
  },
};

export default nextConfig;
