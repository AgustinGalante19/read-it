import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { getDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { getMyBooks } from '@/services/Library';
import { BookStatus } from '@/types/Book';
import { BookCheck, BookMarked, BookText, BookX, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Option {
  id: number;
  value: BookStatus;
  icon: React.ReactNode;
  label: string;
}

const options: Option[] = [
  { id: 3, value: 'all', label: 'Saved Books', icon: <BookMarked size={18} /> },
  { id: 1, value: 'readed', label: 'Readed', icon: <BookCheck size={18} /> },
  { id: 2, value: 'notReaded', label: 'Not Readed', icon: <BookX size={18} /> },
];

async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const status = (await searchParams).status || 'all';
  const books = await getMyBooks(status as BookStatus);

  return (
    <div>
      <header className='w-full flex p-4 justify-between items-center container mx-auto'>
        <span className='text-2xl font-bold text-white flex items-center gap-2 underline decoration-primary'>
          My Library
        </span>
      </header>
      <section className='px-4'>
        <Carousel
          opts={{
            align: 'start',
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-1'>
            {options.map((opt) => (
              <div key={opt.label} className='pr-1'>
                <CarouselItem className='pl-1'>
                  <Link
                    href={`/library?status=${opt.value}`}
                    className={cn(
                      'px-4 py-3 text-white rounded-full flex items-center gap-1 text-sm font-semibold text-nowrap',
                      opt.value === status
                        ? 'bg-primary text-cgray'
                        : 'border border-gray-500'
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </Link>
                </CarouselItem>
              </div>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      <section className='grid grid-cols-2 gap-2 py-4'>
        {books.result.map((book) => (
          <Link key={book.id} href={`/book/${book.google_id}`}>
            <article
              className={'my-2 text-white flex flex-col h-64 w-32 mx-auto'}
            >
              <Image
                alt={`${book.title} cover`}
                src={book.thumbnail_url || '/small-thumbnail-fallback.jpg'}
                width={128}
                height={205}
              />
              <div className={'flex flex-col '}>
                <span className='font-semibold truncate w-full max-w-full'>
                  {book.title}
                </span>
                <span className='font-light truncate w-full max-w-full'>
                  {book.authors}
                </span>
                <div className={'flex gap-1'}>
                  <div className='flex gap-1 items-center'>
                    <Calendar size={14} />
                    <span className='text-xs text-nowrap'>
                      {getDateString(book.publish_date)}
                    </span>
                  </div>
                  <div className='flex gap-1 items-center'>
                    <BookText size={14} />
                    <span className='text-xs'>{book.page_count}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default LibraryPage;
