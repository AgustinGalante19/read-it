import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import Container from '@/components/ui/container';
import Topbar from '@/components/topbar';
import BottomBar from '@/components/bottombar';

export const metadata: Metadata = {
  title: 'Read It',
  description: '',
};

const GeistFont = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${GeistFont.className} antialiased`}>
        <Container>
          <div className='flex flex-col min-h-screen'>
            <div className='flex-1 relative'>
              <Topbar />
              {children}
            </div>
            <BottomBar />
          </div>
        </Container>
      </body>
    </html>
  );
}
