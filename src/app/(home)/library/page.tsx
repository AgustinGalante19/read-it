import BookCard from '@/components/book/book-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { getMyBooks } from '@/services/Library';
import { BookStatus } from '@/types/Book';
import { BookCheck, BookMarked, BookX } from 'lucide-react';
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

export default async function LibraryPage({
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
        <Carousel className='w-full'>
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
                    {opt.value === status && (
                      <span className='text-xs p-1 rounded-full bg-background text-foreground text-center w-6 h-6'>
                        {books.result.length}
                      </span>
                    )}
                  </Link>
                </CarouselItem>
              </div>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      <section>
        <ul className='grid grid-cols-2 gap-2 py-4'>
          {books.result.map((book) => (
            <li key={book.id} className='mx-auto w-fit'>
              <BookCard book={book} mode='vertical' />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
