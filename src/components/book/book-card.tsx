'use client';

import { getDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Book } from '@/types/Book';
import { BookText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';

type CardMode = 'vertical' | 'horizontal';

const BookImage = React.memo(
  ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => {
    return (
      <Image alt={alt} src={src} width={width} height={height} loading='lazy' />
    );
  }
);
BookImage.displayName = 'BookImage';

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

  const imageSrc = useMemo(
    () => book.thumbnail_url || '/small-thumbnail-fallback.jpg',
    [book.thumbnail_url]
  );

  return (
    <Link href={`/book/${book.google_id}`}>
      <article
        className={cn(
          'my-2 text-white',
          mode === 'horizontal'
            ? 'flex max-h-20 w-full'
            : 'flex flex-col h-64 w-32'
        )}
      >
        <BookImage
          alt={`${book.title} cover`}
          height={imageSize.height}
          width={imageSize.width}
          src={imageSrc}
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

export default React.memo(BookCard);
