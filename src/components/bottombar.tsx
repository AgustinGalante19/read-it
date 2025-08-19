'use client';

import { cn } from '@/lib/utils';
import { ChartBar, Home, Library, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

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
        'flex flex-col items-center gap-2 px-4 py-2 text-white',
        isActive && 'text-primary'
      )}
    >
      <div
        className={cn(
          'py-1 px-3',
          isActive && 'rounded-full bg-primary text-primary-foreground'
        )}
      >
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
};

function BottomBar() {
  return (
    <footer className='w-full fixed bottom-0 bg-background border-t border-t-secondary'>
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
