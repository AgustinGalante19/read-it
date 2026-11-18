'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AccountMenu from './account-menu';

function Topbar({ showSearch }: { showSearch: boolean }) {
  return (
    <header className='grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 min-[600px]:min-h-18 min-[600px]:gap-4 min-[1024px]:sticky min-[1024px]:top-[env(safe-area-inset-top,0px)] min-[1024px]:z-40 min-[1024px]:grid-cols-[208px_minmax(0,1fr)] min-[1024px]:bg-background'>
      <Link
        href='/'
        aria-label='Read It home'
        className='-ms-2 flex min-h-12 w-fit items-center gap-1 rounded-full pe-2 text-xl font-medium whitespace-nowrap'
      >
        <Image
          src='/readit-logo.png'
          width={48}
          height={48}
          alt=''
          className='shrink-0 hue-rotate-[75deg]'
        />
        <span>Read It</span>
      </Link>
      {showSearch && (
        <Link
          href='/search'
          className='hidden h-12 w-full max-w-[720px] items-center gap-3 rounded-full bg-surface-container-high px-4 text-sm text-muted-foreground transition-colors duration-150 hover:bg-foreground/12 hover:text-foreground min-[600px]:flex'
        >
          <Search aria-hidden='true' className='size-5 shrink-0' />
          Search books
        </Link>
      )}
      <div className='col-start-3 min-[1024px]:hidden'><AccountMenu /></div>
    </header>
  );
}

export default Topbar;
