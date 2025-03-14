import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import Container from '@/components/ui/container';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Read It',
  description: 'My personal app to use as readlist',
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
        <link rel='icon' type='image/svg+xml' href='/favicon-32x32.png' />
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
