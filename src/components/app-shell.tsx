'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AppNavigation from './app-navigation';
import Topbar from './topbar';
import Container from './ui/container';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const usesWidePanel = ['/', '/search', '/library', '/highlights', '/stats', '/calendar'].includes(pathname);

  return (
    <div className='flex min-h-dvh flex-col pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[env(safe-area-inset-top,0px)]'>
      <a
        href='#app-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-[calc(1rem+env(safe-area-inset-top,0px))] focus:left-[calc(1rem+env(safe-area-inset-left,0px))] focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground'
      >
        Skip to content
      </a>
      <Topbar showSearch={pathname !== '/search'} />
      <div className='flex grow pb-(--bottom-bar-height) min-[600px]:grid min-[600px]:grid-cols-[80px_minmax(0,1fr)] min-[600px]:pb-[env(safe-area-inset-bottom,0px)] min-[1024px]:grid-cols-[240px_minmax(0,1fr)]'>
        <AppNavigation pathname={pathname} />
        <div
          id='app-content'
          tabIndex={-1}
          className='min-w-0 grow bg-surface min-[600px]:me-4 min-[600px]:mb-4 min-[600px]:rounded-3xl'
        >
          {usesWidePanel ? children : <Container>{children}</Container>}
        </div>
      </div>
    </div>
  );
}
