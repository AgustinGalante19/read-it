import type { Metadata } from 'next';
import { ABeeZee } from 'next/font/google';
import Providers from '@/components/providers';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Read It',
  description: 'My personal to use as readlist',
};

const ABeeZeeFont = ABeeZee({ subsets: ['latin'], weight: ['400'] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='icon'
          type='image/png'
          href='/favicon-96x96.png'
          sizes='96x96'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <meta name='apple-mobile-web-app-title' content='Read-It' />
      </head>
      <body className={`${ABeeZeeFont.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
