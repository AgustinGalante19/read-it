'use client';

import { cn } from '@/lib/utils';
import datesHelper from '@/services/helpers/DatesHelper';
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
      : { width: 150, height: 230 };
  }, [mode]);

  return (
    <Link href={`/book/${book.google_id}`}>
      <article
        className={cn(
          'my-2 text-white',
          mode === 'horizontal' ? 'flex max-h-20 w-61' : 'flex flex-col w-36',
        )}
      >
        <Image
          alt={`${book.title} cover`}
          height={imageSize.height}
          width={imageSize.width}
          src={book?.thumbnail_url || '/thumbnail-fallback.jpg'}
          loading='lazy'
          className={cn(
            'max-h-51.25 min-h-19.25',
            mode === 'horizontal' ? 'h-19.25' : 'h-51.25',
          )}
        />
        <div
          className={cn(
            'flex flex-col overflow-hidden',
            mode === 'horizontal' ? 'ml-4' : 'mt-1',
          )}
        >
          <span className='font-semibold truncate w-full max-w-full'>
            {book.title}
          </span>
          <span className='font-light truncate w-full max-w-full text-secondary-foreground'>
            {book.authors}
          </span>
          <div
            className={cn(
              'flex',
              mode === 'horizontal' ? 'gap-4' : 'justify-between',
            )}
          >
            <div className='flex gap-1 items-center text-muted-foreground'>
              <Calendar size={14} />
              <span className='text-xs text-nowrap '>
                {datesHelper.getDateString(book.publish_date)}
              </span>
            </div>
            <div className='flex gap-1 items-center text-muted-foreground'>
              <BookText size={14} />
              <span className='text-xs '>{book.page_count}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default React.memo(BookCard);
