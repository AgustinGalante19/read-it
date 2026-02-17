import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'books.google.com' },
      { hostname: 'read-it.site' },
      {
        hostname: 'agustin-self-host.tail8cb9eb.ts.net',
        port: '8888',
        protocol: 'http',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  experimental: {
    mcpServer: true,
  },
};

export default nextConfig;
