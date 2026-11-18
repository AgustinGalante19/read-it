'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import BookCover from '@/components/book/book-cover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TimelineData {
  date: string;
  totalDuration: number;
  booksRead: number;
  details: {
    bookId: string;
    title: string;
    start_date?: string;
    duration: number;
    thumbnail_url?: string;
    isFinishedEvent?: boolean;
  }[];
}

interface ReadingTimelineProps {
  data: TimelineData[];
  year: number;
  month: number;
}

export function ReadingTimeline({ data, year, month }: ReadingTimelineProps) {
  const start = new Date(year, month - 1, 1);
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });

  const formatDuration = (seconds: number, short = false) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      if (short) return `+${hours}h`;
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className='min-w-0 border-none shadow-none'>
      <CardContent className='p-0'>
        <div aria-label='Monthly reading activity' className='grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className='bg-surface-container py-2 text-center text-xs font-medium text-muted-foreground min-[600px]:py-3 min-[600px]:text-sm'
            >
              {day}
            </div>
          ))}
          {Array.from({ length: start.getDay() }).map((_, i) => (
            <div
              key={`empty-${i}`}
              aria-hidden='true'
              className='min-h-[90px] bg-background min-[600px]:min-h-30 min-[1024px]:min-h-46 min-[1440px]:min-h-48'
            />
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayData = data.find((d) => d.date === dateStr);
            const isCurrentMonth = isSameMonth(day, start);
            const visibleBooks = (dayData?.details ?? [])
              .map((book) => ({
                book,
                isStartDate: Boolean(
                  book.start_date &&
                  format(new Date(book.start_date), 'yyyy-MM-dd') === dateStr,
                ),
              }))
              .filter(({ book, isStartDate }) =>
                book.duration > 500 || book.isFinishedEvent || isStartDate,
              );

            return (
              <div
                key={day.toISOString()}
                aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                className={cn('relative flex min-h-[90px] min-w-0 flex-col gap-1 bg-background p-1 transition-colors hover:bg-muted/30 min-[600px]:min-h-30 min-[600px]:gap-2 min-[600px]:p-2 min-[1024px]:min-h-46 min-[1024px]:p-3 min-[1440px]:min-h-48', !isCurrentMonth && 'text-muted-foreground/30')}
              >
                <div className='flex min-w-0 flex-wrap items-start justify-between gap-1'>
                  <span
                    className={
                      isToday(day)
                        ? 'flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground min-[600px]:size-6 min-[600px]:text-sm'
                        : `text-xs font-medium min-[600px]:text-sm ${
                            dayData && dayData.totalDuration >= 500
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`
                    }
                  >
                    {format(day, 'd')}
                  </span>
                  {dayData && dayData.totalDuration >= 600 && (
                    <span className='max-w-full rounded-full bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary min-[600px]:px-1.5 min-[600px]:text-xs'>
                      {formatDuration(dayData.totalDuration, true)}
                    </span>
                  )}
                </div>

                <div className='mt-auto flex min-w-0 flex-wrap items-center justify-center gap-1 min-[600px]:gap-2'>
                  {visibleBooks.map(({ book, isStartDate }) => {
                    return (
                      <TooltipProvider key={book.bookId}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/book/${book.bookId}`}
                              aria-label={`${book.title}${book.isFinishedEvent ? ', finished this day' : isStartDate ? ', started this day' : ''}`}
                              className={cn(
                                'relative aspect-[2/3] w-10 max-w-full shrink-0 overflow-hidden rounded-sm bg-muted shadow-sm transition-shadow hover:ring-2 hover:ring-primary min-[1024px]:w-20 min-[1440px]:w-22',
                                visibleBooks.length > 1 && 'min-[1024px]:w-[min(5rem,calc((100%-0.5rem)/2))] min-[1440px]:w-[min(5.5rem,calc((100%-0.5rem)/2))]',
                                book.isFinishedEvent ? 'ring-2 ring-primary' : isStartDate && 'ring-2 ring-outline',
                              )}
                            >
                              <BookCover
                                src={book.thumbnail_url}
                                className='absolute inset-0'
                                sizes='(min-width: 1440px) 88px, (min-width: 1024px) 80px, 40px'
                              />
                              {book.isFinishedEvent && (
                                <span className='absolute inset-x-0 bottom-0 bg-primary text-center text-[8px] font-bold uppercase text-primary-foreground min-[1024px]:text-[10px]'>
                                  Done
                                </span>
                              )}
                              {isStartDate && !book.isFinishedEvent && (
                                <span className='absolute inset-x-0 top-0 bg-primary-container text-center text-[8px] font-bold uppercase text-primary-container-foreground min-[1024px]:text-[10px]'>
                                  Start
                                </span>
                              )}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className='flex flex-col gap-1'>
                              <span className='font-semibold'>
                                {book.title}
                              </span>
                              {book.duration > 0 && (
                                <span className='text-xs text-muted-foreground'>
                                  Read for {formatDuration(book.duration)}
                                </span>
                              )}
                              {book.isFinishedEvent && (
                                <span className='text-xs font-bold text-primary'>
                                  Finished this day!
                                </span>
                              )}
                              {isStartDate && (
                                <span className='text-xs font-bold text-accent-foreground'>
                                  Started this day!
                                </span>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {Array.from({ length: 6 - end.getDay() }, (_, index) => (
            <div
              key={`end-empty-${index}`}
              aria-hidden='true'
              className='min-h-[90px] bg-background min-[600px]:min-h-30 min-[1024px]:min-h-46 min-[1440px]:min-h-48'
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
