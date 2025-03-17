import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import Container from '@/components/ui/container';
import BottomBar from '@/components/bottombar';
import Providers from '@/components/providers';

export const metadata: Metadata = {
  title: 'Read It',
  description: 'My personal to use as readlist',
};

const GeistFont = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
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
      </head>
      <body className={`${GeistFont.className} antialiased`}>
        <Providers>
          <Container>
            <div className='flex flex-col min-h-screen'>
              <div className='flex-1 relative pb-24'>{children}</div>
            </div>
          </Container>
          <BottomBar />
        </Providers>
      </body>
    </html>
  );
}
