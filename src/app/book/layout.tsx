import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import Container from '@/components/ui/container';
import { Toaster } from '@/components/ui/sonner';

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
        <link
          rel='icon'
          type='image/png'
          href='/favicon-32x32.png'
          sizes='32x32'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon-32x32.png' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
      </head>
      <body className={`${GeistFont.className} antialiased`}>
        <Container>
          {children}
          <Toaster />
        </Container>
      </body>
    </html>
  );
}
