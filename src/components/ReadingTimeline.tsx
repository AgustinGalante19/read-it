'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface TimelineData {
  date: string;
  totalDuration: number;
  booksRead: number;
  details: {
    bookId: string;
    title: string;
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
  console.log(data);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className='col-span-4 border-none shadow-none mx-2'>
      <CardContent className='p-0'>
        <div className='grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className='bg-muted/50 p-2 text-sm font-medium text-muted-foreground text-center'
            >
              {day}
            </div>
          ))}
          {Array.from({ length: start.getDay() }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className='bg-background p-1.5 min-h-[90px]'
            />
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayData = data.find((d) => d.date === dateStr);
            const isCurrentMonth = isSameMonth(day, start);

            return (
              <div
                key={day.toISOString()}
                className={`bg-background p-1.5 min-h-[90px] flex flex-col gap-1 relative group transition-colors hover:bg-muted/30 ${!isCurrentMonth ? 'text-muted-foreground/30' : ''
                  }`}
              >
                <div className='flex justify-between items-start z-10'>
                  <span
                    className={`text-xs font-medium ${dayData ? 'text-primary' : 'text-muted-foreground'
                      }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayData && dayData.totalDuration >= 600 && (
                    <span className='text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full'>
                      {formatDuration(dayData.totalDuration)}
                    </span>
                  )}
                </div>

                <div className='flex flex-wrap gap-1 mt-auto items-center justify-center'>
                  {dayData?.details.map((book) => {
                    if (book.duration <= 500 && !book.isFinishedEvent)
                      return null;
                    return (
                      <TooltipProvider key={book.bookId}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/book/${book.bookId}`}
                              className={`relative w-10 h-14 bg-muted rounded-sm overflow-hidden hover:ring-2 ring-primary transition-all hover:scale-110 shadow-sm ${book.isFinishedEvent
                                ? 'ring-2 ring-emerald-500'
                                : ''
                                }`}
                            >
                              <Image
                                src={book.thumbnail_url || '/placeholder.svg'}
                                alt={book.title}
                                fill
                                className='object-cover'
                                sizes='40px'
                              />
                              {book.isFinishedEvent && (
                                <div className='absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-emerald-500/80 to-transparent flex items-end justify-center pb-1'>
                                  <span className='text-[8px] font-bold text-white uppercase tracking-tighter'>
                                    Done
                                  </span>
                                </div>
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
                                <span className='text-xs font-bold text-emerald-500'>
                                  Finished this day!
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
        </div>
      </CardContent>
    </Card>
  );
}
