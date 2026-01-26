'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { Book } from '@/types/Book';
import Link from 'next/link';

interface BookItemProps {
  book: Book;
  booksForDay: Book[];
}

export const BookItem: React.FC<BookItemProps> = ({ book, booksForDay }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='relative h-20 w-full'>
            <Link href={`/book/${book.google_id}`}>
              <Image
                src={book.thumbnail_url || '/placeholder.svg'}
                alt={book.title}
                fill
                className='object-contain hover:scale-105 transition-transform'
              />
              {booksForDay.length > 1 && (
                <div className='absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full'>
                  +{booksForDay.length - 1}
                </div>
              )}
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span className='font-semibold'>{book.title}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
