import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import Container from '@/components/ui/container';

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
        <Container>{children}</Container>
      </body>
    </html>
  );
}
