import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Read-It',
    short_name: 'Read-It',
    description: 'The best app to make your readlist',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/ico',
      },
      {
        src: '/mstile-70x70.png',
        sizes: '70x670',
        type: 'image/png',
      },
      {
        src: '/mstile-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/mstile-150x150.png',
        sizes: '150x150',
        type: 'image/png',
      },
      {
        src: '/mstile-310x150.png',
        sizes: '310x150',
        type: 'image/png',
      },
      {
        src: '/mstile-310x310.png',
        sizes: '310x310',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
