import { getDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Book } from '@/types/Book';
import { BookText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';

type CardMode = 'vertical' | 'horizontal';

function BookCard({
  book,
  mode = 'horizontal',
  urlId,
}: {
  book: Book;
  mode?: CardMode;
  urlId: string | number;
}) {
  const imageSize = useMemo(
    () =>
      mode === 'horizontal'
        ? { width: 53, height: 77 }
        : { width: 128, height: 194 },
    [mode]
  );

  return (
    <Link href={`/book/${urlId}`}>
      <article
        className={cn(
          'my-2 text-white',
          mode === 'horizontal'
            ? 'flex max-h-20 w-full'
            : 'flex flex-col h-64 w-32'
        )}
      >
        <Image
          alt={`${book.title} cover`}
          src={book.thumbnail_url || '/small-thumbnail-fallback.jpg'}
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
            {book.title}
          </span>
          <span className='font-light truncate w-full max-w-full'>
            {book.authors}
          </span>
          <div
            className={cn('flex', mode === 'horizontal' ? 'gap-4' : 'gap-1')}
          >
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
  );
}

export default BookCard;
