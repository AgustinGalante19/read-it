import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import Container from '@/components/ui/container';
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
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={`${GeistFont.className} antialiased`}>
        <Container>
          <Providers>
            <div className='flex flex-col min-h-screen'>
              <div className='flex-1 relative'>{children}</div>
            </div>
          </Providers>
        </Container>
      </body>
    </html>
  );
}
