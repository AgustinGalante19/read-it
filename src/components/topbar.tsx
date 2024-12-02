import getTimeDescOfDay from '@/lib/getTimeDescOfDay';
import { CloudSun, Moon, Sun } from 'lucide-react';
import Image from 'next/image';

function Topbar() {
  const timeDesc = getTimeDescOfDay();

  return (
    <header className='w-full flex p-4 justify-between items-center container mx-auto'>
      <span className='text-2xl font-bold text-white flex items-center gap-2'>
        {timeDesc === 'Morning' ? (
          <Sun className='text-primary' />
        ) : timeDesc === 'Afternoon' ? (
          <CloudSun className='text-primary' />
        ) : (
          <Moon className='text-primary' />
        )}
        <span>Good</span> {timeDesc}
      </span>
      <Image
        src='/book-nexus-logo.svg'
        width={20}
        height={20}
        alt='nexus books logo'
      />
    </header>
  );
}

export default Topbar;
