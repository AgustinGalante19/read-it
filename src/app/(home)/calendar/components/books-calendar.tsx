'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getYear,
  getMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Book } from '@/types/Book';
import Link from 'next/link';

interface CalendarProps {
  books: Book[];
}

export default function Calendar({ books }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const handleMonthYearChange = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setCurrentDate(new Date(year, month));
  };

  const monthYearOptions = Array.from({ length: 24 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: `${getYear(date)}-${getMonth(date)}`,
      label: format(date, 'MMMM yyyy'),
    };
  });

  return (
    <div className='bg-background'>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <Button variant='outline' size='icon' onClick={handlePrevMonth}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Select
            value={`${getYear(currentDate)}-${getMonth(currentDate)}`}
            onValueChange={handleMonthYearChange}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Select a month' />
            </SelectTrigger>
            <SelectContent>
              {monthYearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant='outline' size='icon' onClick={handleNextMonth}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
        <MonthView month={currentDate} books={books} />
      </div>
    </div>
  );
}

function MonthView({ month, books }: { month: Date; books: Book[] }) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className='bg-background border rounded-lg overflow-hidden'>
      <h3 className='text-xl font-medium p-3 bg-muted text-center'>
        {format(month, 'MMMM yyyy')}
      </h3>
      <div className='grid grid-cols-7 gap-px bg-border'>
        {['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='bg-background p-2 text-sm text-muted-foreground text-center'
          >
            {day}
          </div>
        ))}
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className='bg-background p-2' />
        ))}
        {days.map((day) => {
          const booksForDay = books.filter((book) =>
            isSameDay(book.readed_at, day)
          );
          const book = booksForDay[0];

          return (
            <div
              key={day.toString()}
              className='bg-background p-2 min-h-[100px] border-t relative group'
            >
              <div className='text-sm mb-1'>{format(day, 'd')}</div>
              {book && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='relative h-[80px] w-full'>
                        <Link href={`/book/${book.google_id}`}>
                          <Image
                            src={book.thumbnail_url || '/placeholder.svg'}
                            alt={book.title}
                            fill
                            className='object-contain hover:scale-105 transition-transform'
                          />
                          {booksForDay.length > 1 && (
                            <div className='absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full'>
                              +{booksForDay.length - 1}
                            </div>
                          )}
                        </Link>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='font-semibold'>{book.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
