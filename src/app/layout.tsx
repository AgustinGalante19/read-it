import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
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
        <div className='flex flex-col min-h-screen'>
          <div className='flex-1 relative'>
            <Topbar />
            {children}
          </div>
          <BottomBar />
        </div>
      </body>
    </html>
  );
}
