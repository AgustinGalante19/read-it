'use client';

import { ChevronsUpDown, LogOut, ScreenShare, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient, useSession } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function AccountMenu({ placement = 'topbar' }: { placement?: 'topbar' | 'sidebar' }) {
  const { data } = useSession();
  const router = useRouter();
  const sidebar = placement === 'sidebar';
  const name = data?.user?.name?.trim() || 'My Account';
  const email = data?.user?.email;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeMenu = () => setOpen(false);
    desktop.addEventListener('change', closeMenu);
    return () => desktop.removeEventListener('change', closeMenu);
  }, []);

  const avatar = (
    <Avatar className={cn('size-9 shrink-0', sidebar && 'rounded-lg')}>
      <AvatarImage src={data?.user?.image || undefined} alt='' />
      <AvatarFallback className={cn('bg-primary-container text-sm font-medium text-primary-container-foreground', sidebar && 'rounded-lg')}>
        {data?.user?.name?.trim().charAt(0).toUpperCase() || <UserRound aria-hidden='true' className='size-5' />}
      </AvatarFallback>
    </Avatar>
  );

  const identity = (
    <span className='flex min-h-10 min-w-0 flex-1 flex-col justify-center'>
      <span className='truncate text-sm/5 font-medium'>{name}</span>
      {email && <span className='truncate text-xs/5 text-muted-foreground'>{email}</span>}
    </span>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label='My Account'
        className={cn(
          'cursor-pointer transition-colors duration-150 hover:bg-foreground/8 active:bg-foreground/12 data-[state=open]:bg-surface-container-high',
          sidebar
            ? 'flex w-full items-center gap-3 rounded-xl p-2 text-start'
            : 'grid size-12 place-items-center rounded-full',
        )}
      >
        {avatar}
        {sidebar && <>{identity}<ChevronsUpDown aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' /></>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        aria-label='My Account'
        side={sidebar ? 'right' : 'bottom'}
        align='end'
        sideOffset={8}
        collisionPadding={12}
        className='w-60 max-w-[calc(100vw-1.5rem)] rounded-2xl border-outline-variant bg-surface-container-high p-2 text-foreground'
      >
        <DropdownMenuLabel className='flex items-center gap-3'>{avatar}{identity}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className='min-h-12 cursor-pointer rounded-lg min-[1024px]:min-h-9'>
            <Link href='/devices'><ScreenShare aria-hidden='true' />Devices</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='min-h-12 cursor-pointer rounded-lg min-[1024px]:min-h-9'
            onSelect={async () => {
              await authClient.signOut();
              router.push('/sign-in');
            }}
          >
            <LogOut aria-hidden='true' />Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
