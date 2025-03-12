'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

function Topbar() {
  const { data } = useSession();

  return (
    <header className='w-full flex p-4 justify-between items-center container mx-auto'>
      <Image
        src='/book-nexus-logo.svg'
        width={25}
        height={50}
        alt='read-it logo'
      />
      <span className='text-2xl font-bold text-white flex items-center gap-2'>
        Hi, {data?.user?.name}!
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={data?.user?.image || undefined} />
            <AvatarFallback>{data?.user?.name?.substring(0, 1)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Topbar;
