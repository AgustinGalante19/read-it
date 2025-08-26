'use client';

import { cn } from '@/lib/utils';
import { ChartBar, Home, Library, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useEffect } from 'react';

const LinkItem = ({
  label,
  icon,
  url,
}: {
  label: string;
  url: string;
  icon: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isActive = useMemo(() => pathname === url, [pathname, url]);

  return (
    <Link
      href={url}
      className={cn(
        'flex flex-col items-center gap-2 px-4 py-2',
        isActive && 'text-primary'
      )}
    >
      <div
        className={cn(
          'py-1 px-4',
          isActive &&
            'rounded-full bg-secondary-container text-secondary-container-foreground'
        )}
      >
        {icon}
      </div>
      <span className='text-secondary-foreground'>{label}</span>
    </Link>
  );
};

function BottomBar() {
  useEffect(() => {
    // Establecer la altura de la barra de navegación como CSS custom property
    const updateBottomBarHeight = () => {
      const bottomBar = document.querySelector(
        '[data-bottom-bar]'
      ) as HTMLElement;
      if (bottomBar) {
        const height = bottomBar.offsetHeight;
        document.documentElement.style.setProperty(
          '--bottom-bar-height',
          `${height}px`
        );
      }
    };

    // Calcular inicialmente
    updateBottomBarHeight();

    // Recalcular en cambios de ventana
    window.addEventListener('resize', updateBottomBarHeight);

    return () => window.removeEventListener('resize', updateBottomBarHeight);
  }, []);

  return (
    <footer
      data-bottom-bar
      className='fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border z-50'
    >
      <div className='max-w-md mx-auto flex justify-between'>
        <LinkItem label='Home' icon={<Home />} url='/' />
        <LinkItem label='Search' icon={<Search />} url='/search' />
        <LinkItem label='Library' icon={<Library />} url='/library' />
        <LinkItem label='Stats' icon={<ChartBar />} url='/stats' />
      </div>
    </footer>
  );
}

export default BottomBar;
