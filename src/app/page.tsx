import { Glasses, Headphones } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BookCard = () => {
  return (
    <Link href='#' className='flex flex-col h-64 w-32 text-white'>
      <Image
        src='/1793-img.jpg'
        className=''
        alt='1793 by Niklas Natt och Dag'
        width={128}
        height={194}
      />
      <div className='mt-1'>
        <h5 className='font-semibold'>1793</h5>
        <h6 className='text-sm font-light'>Niklas Natt och Dag</h6>
      </div>
      <footer className='flex gap-4 mt-2'>
        <div className='flex gap-1 items-center'>
          <Headphones size={14} />
          <span className='text-xs'> 5m</span>
        </div>
        <div className='flex gap-1 items-center'>
          <Glasses size={14} />
          <span className='text-xs'> 15m</span>
        </div>
      </footer>
    </Link>
  );
};

export default function Home() {
  return (
    <div className='container mx-auto max-sm:p-4 space-y-8'>
      <section>
        <h3 className='font-semibold text-2xl'>My Readlist</h3>
        <div className='flex gap-4 my-2'>
          <BookCard />
          <BookCard />
        </div>
      </section>
      <section>
        <h3 className='font-semibold text-2xl my-2'>Readed</h3>
        <div className='flex gap-4'>
          <BookCard />
          <BookCard />
        </div>
      </section>
    </div>
  );
}
