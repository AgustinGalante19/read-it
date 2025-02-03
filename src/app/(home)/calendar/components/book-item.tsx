'use client';
import { parseISO, format } from 'date-fns';
import Image from 'next/image';
import { Book } from '@/types/Book';

interface BookItemProps {
  book: Book;
}

export const BookItem: React.FC<BookItemProps> = ({ book }) => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='relative h-48'>
        <Image
          src={book.thumbnail_url || `/thumbnail-fallback.jpg`}
          alt={book.title}
          layout='fill'
          objectFit='cover'
        />
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-lg mb-2'>{book.title}</h3>
        <p className='text-sm text-gray-600'>
          {format(parseISO(book.readed_at.toISOString()), 'MMMM d, yyyy')}
        </p>
      </div>
    </div>
  );
};
