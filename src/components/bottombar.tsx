'use client';

import { cn } from '@/lib/utils';
import { Home, Library, Search } from 'lucide-react';
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
        isActive &&
          'bg-gradient-to-b from-primary/5 to-transparent text-primary'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

function BottomBar() {
  return (
    <footer className='flex justify-evenly w-full bottom-0 pb-4 border-t-2 border-white/10'>
      <LinkItem label='Home' icon={<Home />} url='/' />
      <LinkItem label='Search' icon={<Search />} url='/search' />
      <LinkItem label='Library' icon={<Library />} url='/library' />
    </footer>
  );
}

export default BottomBar;
