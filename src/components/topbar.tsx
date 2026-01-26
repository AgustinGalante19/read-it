'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Github, Highlighter, LogOut, ScreenShare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient, useSession } from '@/lib/auth/auth-client';

function Topbar() {
  const { data } = useSession();
  const router = useRouter();

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
          <DropdownMenuItem onClick={() => router.push('/highlights')}>
            <Highlighter />
            My Highlights
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/devices')}>
            <ScreenShare />
            Devices
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();
              router.push('/sign-in');
            }}
          >
            <LogOut />
            Sign Out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={'https://github.com/AgustinGalante19/read-it'}
              target='_blank'
            >
              <Github />
              Contribute
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Topbar;
