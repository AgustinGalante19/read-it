'use client';

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
}: {
  book: Book;
  mode?: CardMode;
}) {
  const imageSize = useMemo(() => {
    return mode === 'horizontal'
      ? { width: 53, height: 77 }
      : { width: 128, height: 205 };
  }, [mode]);

  return (
    <Link href={`/book/${book.google_id}`}>
      <article
        className={cn(
          'my-2 text-white',
          mode === 'horizontal'
            ? 'flex max-h-20 w-[244px]'
            : 'flex flex-col h-64 w-32'
        )}
      >
        <Image
          alt={`${book.title} cover`}
          height={imageSize.height}
          width={imageSize.width}
          src={book?.thumbnail_url || '/thumbnail-fallback.jpg'}
          loading='lazy'
          className={cn(
            'max-h-[205px] min-h-[77px]',
            mode === 'horizontal' ? 'h-[77px]' : 'h-[205px]'
          )}
        />
        <div
          className={cn(
            'flex flex-col overflow-hidden',
            mode === 'horizontal' ? 'ml-4' : 'mt-1'
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

export default React.memo(BookCard);
