'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Book, BookStatus } from '@/types/Book';
import { updateBookStatus } from '@/services/BookService';
import datesHelper from '@/services/helpers/DatesHelper';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import BookCover from './book-cover';

export default function CurrentlyReadingCard({ book }: { book: Book }) {
  const [isFinishing, startTransition] = useTransition();
  const pagesRead = book.book_total_read_pages;
  const totalPages = book.page_count;
  const readingTime = book.book_total_read_time;
  const progress =
    pagesRead != null && totalPages > 0
      ? Math.min(100, Math.max(0, Math.round((pagesRead / totalPages) * 100)))
      : null;

  function markAsFinished() {
    startTransition(async () => {
      try {
        const result = await updateBookStatus(BookStatus.READ, book.google_id);
        if (!result.success) {
          toast.error('Could not mark the book as finished. Try again.');
        }
      } catch {
        toast.error('Could not mark the book as finished. Try again.');
      }
    });
  }

  return (
    <article className='relative grid h-full grid-cols-[4.5rem_minmax(0,1fr)] grid-rows-[1fr_auto] gap-x-4 gap-y-3 min-[600px]:grid-cols-[6rem_minmax(0,1fr)] min-[1024px]:grid-cols-[7.5rem_minmax(0,1fr)]'>
      <div className='row-span-2 self-start'>
        <BookCover
          src={book.thumbnail_url}
          sizes='(min-width: 1024px) 120px, (min-width: 600px) 96px, 72px'
        />
      </div>
      <div className='min-w-0'>
        <h3 className='line-clamp-2 text-lg/6 font-medium wrap-anywhere'>
          <Link
            href={`/book/${book.google_id}`}
            className='after:absolute after:inset-0 after:rounded-sm hover:text-primary focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary'
          >
            {book.title}
          </Link>
        </h3>
        {book.authors && (
          <p className='mt-1 line-clamp-2 text-sm/5 text-muted-foreground wrap-anywhere'>
            {book.authors}
          </p>
        )}
        <div className='mt-3 max-w-xl space-y-2 text-sm/5 text-muted-foreground'>
          {progress !== null ? (
            <>
              <div className='flex flex-wrap items-baseline justify-between gap-x-3'>
                <span className='font-medium text-primary'>{progress}% complete</span>
                <span>{pagesRead} / {totalPages} pages</span>
              </div>
              <Progress value={progress} aria-label='Reading progress' />
            </>
          ) : (
            <p>{pagesRead != null ? `${pagesRead} pages read` : 'Progress unavailable'}</p>
          )}
          {readingTime != null && (
            <p>Reading time: {datesHelper.formatSecondsToDuration(readingTime)}</p>
          )}
        </div>
      </div>
      <Button
        type='button'
        startIcon={<BadgeCheck />}
        className='relative z-10 col-start-2 h-12 justify-self-start shadow-none transition-colors duration-150 active:scale-100 min-[600px]:h-10'
        isLoading={isFinishing}
        aria-busy={isFinishing}
        onClick={markAsFinished}
      >
        Mark as finished
      </Button>
    </article>
  );
}
