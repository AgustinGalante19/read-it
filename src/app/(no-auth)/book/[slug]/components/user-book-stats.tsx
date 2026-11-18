'use client';

import { CalendarDays, ChartBar, Clock } from 'lucide-react';
import { Book, BookStatus } from '@/types/Book';
import { ResultWithMetadata } from '@/types/Result';
import datesHelper from '@/services/helpers/DatesHelper';
import { format, isValid, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ELECTRONIC_BOOK_TYPE_ID = 1;

function formatDate(value: string | null | undefined, pattern: string) {
  if (!value) return null;

  const date = parseISO(value);
  return isValid(date) ? format(date, pattern) : null;
}

function UserBookStats({
  userBookData,
}: {
  userBookData: ResultWithMetadata<
    Book | null,
    { lastSyncDate: string | null }
  >;
}) {
  const book = userBookData.data;

  if (
    !book ||
    book.book_type_id !== ELECTRONIC_BOOK_TYPE_ID ||
    (book.id_book_status !== BookStatus.READING &&
      book.id_book_status !== BookStatus.READ)
  ) {
    return null;
  }

  const isFinished = book.id_book_status === BookStatus.READ;
  const { book_total_read_pages: pagesRead, page_count: totalPages } = book;
  let progress: number | null = null;
  if (isFinished) {
    progress = 100;
  } else if (pagesRead != null && pagesRead >= 0 && totalPages > 0) {
    progress = Math.min(100, Math.floor((pagesRead / totalPages) * 100));
  }
  const readingTime = book.book_total_read_time ?? 0;
  const duration =
    readingTime > 0 ? datesHelper.formatSecondsToDuration(readingTime) : null;
  const started = formatDate(book.start_date, 'dd/MM/yyyy') ?? 'Not recorded';
  const finished = isFinished
    ? (formatDate(book.finish_date, 'dd/MM/yyyy') ?? 'Not recorded')
    : 'In progress';
  const lastSyncDate = formatDate(
    userBookData.metadata?.lastSyncDate,
    'dd/MM/yyyy HH:mm',
  );

  return (
    <section aria-labelledby='reading-summary-title' className='my-4 lg:order-1 lg:my-0'>
      <Card className='lg:border-0 lg:shadow-none'>
        <CardHeader className='p-4 lg:px-5'>
          <h2 id='reading-summary-title' className='text-base font-semibold lg:font-medium'>
            Reading summary
          </h2>
          {lastSyncDate && (
            <p className='flex items-center gap-1.5 text-xs text-muted-foreground'>
              <ChartBar size={14} aria-hidden='true' />
              Last sync {lastSyncDate}
            </p>
          )}
        </CardHeader>
        <CardContent className='space-y-4 px-4 pb-4 lg:px-5 lg:pb-5'>
          <div className='space-y-2'>
            <div className='flex items-baseline justify-between gap-2 text-sm'>
              <span>
                {pagesRead ?? '—'} / {totalPages > 0 ? totalPages : '—'} pages read
              </span>
              {progress !== null && (
                <span className='font-semibold text-primary tabular-nums'>
                  {progress}%
                </span>
              )}
            </div>
            {progress !== null && (
              <Progress value={progress} aria-label='Reading progress' />
            )}
          </div>
          <dl className='grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 text-sm min-[400px]:grid-cols-3'>
            <div>
              <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Clock size={14} aria-hidden='true' />
                Reading time
              </dt>
              <dd className='mt-1 font-medium'>
                {duration === '0m' ? '< 1m' : (duration ?? 'Not recorded')}
              </dd>
            </div>
            <div>
              <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <CalendarDays size={14} aria-hidden='true' />
                Started
              </dt>
              <dd className='mt-1 font-medium'>{started}</dd>
            </div>
            <div>
              <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <CalendarDays size={14} aria-hidden='true' />
                Finished
              </dt>
              <dd className='mt-1 font-medium'>{finished}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}

export default UserBookStats;
