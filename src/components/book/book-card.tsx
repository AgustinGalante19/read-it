'use client';

import { cn } from '@/lib/utils';
import datesHelper from '@/services/helpers/DatesHelper';
import { Book } from '@/types/Book';
import { BookText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BookCover from './book-cover';

type CardMode = 'vertical' | 'horizontal' | 'cover';

function BookCard({
  book,
  mode = 'horizontal',
}: {
  book: Book;
  mode?: CardMode;
}) {
  if (mode !== 'horizontal') {
    return (
      <Link
        href={`/book/${book.google_id}`}
        className={cn(
          'group flex flex-col gap-3 rounded-sm',
          mode === 'vertical' && 'w-36 max-w-full',
        )}
      >
        <BookCover src={book.thumbnail_url} sizes='(max-width: 599px) 50vw, 180px' />
        <div>
          <h3 className='line-clamp-2 text-base/6 wrap-anywhere transition-colors duration-150 group-hover:text-primary'>
            {book.title}
          </h3>
          {book.authors && (
            <p className='line-clamp-2 text-sm/5 text-muted-foreground wrap-anywhere'>
              {book.authors}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/book/${book.google_id}`}>
      <article className='my-2 flex max-h-20 w-61 text-white'>
        <Image
          alt={`${book.title} cover`}
          height={77}
          width={53}
          src={book?.thumbnail_url || '/thumbnail-fallback.jpg'}
          loading='lazy'
          className='h-19.25 rounded-md'
        />
        <div className='ml-4 flex flex-col overflow-hidden'>
          <span className='font-semibold truncate w-full max-w-full'>
            {book.title}
          </span>
          <span className='font-light truncate w-full max-w-full text-secondary-foreground'>
            {book.authors}
          </span>
          <div className='flex gap-4'>
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
