'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import YearMonthPicker from './year-month-picker';

function DateSelector({ year, month }: { year: number; month: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviousMonthLink = () => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    return `/calendar?year=${prevYear}&month=${prevMonth}`;
  };

  const getNextMonthLink = () => {
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear += 1;
    }
    return `/calendar?year=${nextYear}&month=${nextMonth}`;
  };

  const monthName = new Date(year, month - 1).toLocaleString('en-US', {
    month: 'long',
  });

  return (
    <nav aria-label='Calendar month' className='flex w-full shrink-0 items-center justify-between gap-1 min-[600px]:w-auto min-[600px]:justify-start'>
      <Button variant='ghost' size='icon' asChild>
        <Link href={getPreviousMonthLink()} aria-label='Previous month'>
          <ChevronLeft aria-hidden='true' />
        </Link>
      </Button>
      <Button
        variant='ghost'
        aria-label={`Choose month and year, ${monthName} ${year}`}
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        className='min-w-40'
        onClick={() => setIsOpen(true)}
      >
        {monthName} {year}
      </Button>
      <Button variant='ghost' size='icon' asChild>
        <Link href={getNextMonthLink()} aria-label='Next month'>
          <ChevronRight aria-hidden='true' />
        </Link>
      </Button>
      <YearMonthPicker
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        currentYearValue={year}
        currentMonthValue={monthName}
      />
    </nav>
  );
}

export default DateSelector;
