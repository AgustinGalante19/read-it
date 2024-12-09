import MillionLint from '@million/lint';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'books.google.com' }],
  },
};

export default MillionLint.next({
  enabled: true,
  rsc: true,
})(nextConfig);
