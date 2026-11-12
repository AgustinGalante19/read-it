'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, ScreenShare, Search, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth/auth-client';

function Topbar({ showSearch }: { showSearch: boolean }) {
  const { data } = useSession();
  const router = useRouter();

  return (
    <header className='grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 min-[600px]:min-h-18 min-[600px]:gap-4 min-[1024px]:grid-cols-[208px_minmax(0,1fr)_auto]'>
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
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label='My Account'
          className='col-start-3 grid size-12 cursor-pointer place-items-center rounded-full hover:bg-foreground/8 active:bg-foreground/12'
        >
          <Avatar className='size-9'>
            <AvatarImage src={data?.user?.image || undefined} alt='' />
            <AvatarFallback className='bg-primary-container text-sm font-medium text-primary-container-foreground'>
              {data?.user?.name?.trim().charAt(0).toUpperCase() || (
                <UserRound aria-hidden='true' className='size-5' />
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          sideOffset={8}
          className='min-w-44 rounded-2xl border-outline-variant bg-surface-container-high p-2 text-foreground'
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem asChild className='min-h-12 cursor-pointer rounded-lg'>
            <Link href='/devices'>
              <ScreenShare aria-hidden='true' />
              Devices
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='min-h-12 cursor-pointer rounded-lg'
            onClick={async () => {
              await authClient.signOut();
              router.push('/sign-in');
            }}
          >
            <LogOut aria-hidden='true' />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Topbar;
