import { getDateString } from '@/lib/date-utils';
import getAuthorsString from '@/lib/getAuthorsString';
import { cn } from '@/lib/utils';
import { GoogleBookItem } from '@/types/Book';
import { BookText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';

type CardMode = 'vertical' | 'horizontal';

function BookCard({
  book,
  mode = 'horizontal',
}: {
  book: GoogleBookItem;
  mode?: CardMode;
}) {
  const imageSize = useMemo(
    () =>
      mode === 'horizontal'
        ? { width: 53, height: 77 }
        : { width: 128, height: 194 },
    [mode]
  );

  return (
    <Link href={`/book/${book.id}`}>
      <article
        className={cn(
          'my-2 text-white',
          mode === 'horizontal'
            ? 'flex max-h-20 w-full'
            : 'flex flex-col h-64 w-32'
        )}
      >
        <Image
          alt={`${book.volumeInfo.title} cover`}
          src={
            book.volumeInfo.imageLinks?.smallThumbnail ||
            '/small-thumbnail-fallback.jpg'
          }
          width={imageSize.width}
          height={imageSize.height}
          style={imageSize}
        />
        <div
          className={cn(
            'flex flex-col',
            mode === 'horizontal' ? 'ml-4 overflow-hidden' : 'mt-1'
          )}
        >
          <span className='font-semibold truncate w-full max-w-full'>
            {book.volumeInfo.title}
          </span>
          <span className='font-light truncate w-full max-w-full'>
            {getAuthorsString(book.volumeInfo?.authors)}
          </span>
          <div
            className={cn('flex', mode === 'horizontal' ? 'gap-4' : 'gap-1')}
          >
            <div className='flex gap-1 items-center'>
              <Calendar size={14} />
              <span className='text-xs text-nowrap'>
                {getDateString(book.volumeInfo.publishedDate)}
              </span>
            </div>
            <div className='flex gap-1 items-center'>
              <BookText size={14} />
              <span className='text-xs'>{book.volumeInfo.pageCount}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BookCard;
