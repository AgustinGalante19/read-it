'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChartBar, Home, LibraryBig, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

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
        'flex flex-col items-center gap-2 px-4 py-2 transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <div className='relative px-5 py-1.5'>
        {isActive && (
          <motion.div
            className='absolute inset-0 bg-secondary-container rounded-full'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          />
        )}
        <motion.div
          className='relative z-10'
          animate={isActive ? { scale: [0.8, 1] } : { scale: 1 }}
          transition={
            isActive
              ? {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }
              : {}
          }
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<SVGElement>, {
                className: cn(
                  'transition-colors duration-300 w-6 h-6',
                  isActive
                    ? 'text-secondary-container-foreground'
                    : 'text-muted-foreground'
                ),
              })
            : icon}
        </motion.div>
      </div>
      <span
        className={cn(
          'text-xs font-medium transition-colors',
          isActive ? 'text-secondary-foreground' : 'text-muted-foreground/80'
        )}
      >
        {label}
      </span>
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
      className='fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-border/50 z-50 pb-safe'
    >
      <nav className='max-w-md mx-auto flex justify-between items-center h-full pt-2 pb-2'>
        <LinkItem label='Home' icon={<Home />} url='/' />
        <LinkItem label='Search' icon={<Search />} url='/search' />
        <LinkItem label='Library' icon={<LibraryBig />} url='/library' />
        <LinkItem label='Stats' icon={<ChartBar />} url='/stats' />
      </nav>
    </footer>
  );
}

export default BottomBar;
