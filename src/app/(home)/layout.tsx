import type { Viewport } from 'next';
import AppShell from '@/components/app-shell';

export const viewport: Viewport = { viewportFit: 'cover' };

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
