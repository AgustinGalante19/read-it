import getTimeDescOfDay from '@/lib/getTimeDescOfDay';
import Image from 'next/image';

function Topbar() {
  return (
    <header className='py-4 w-full flex justify-between items-center container mx-auto px-6'>
      <span className='text-2xl font-bold text-white'>
        Good {getTimeDescOfDay()}
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
