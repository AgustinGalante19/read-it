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

  const monthName = new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
  });

  return (
    <div className='flex justify-between w-full items-center gap-4 px-4'>
      <Button variant='ghost' size='icon' asChild>
        <Link href={getPreviousMonthLink()}>
          <ChevronLeft size={4} />
        </Link>
      </Button>
      <Button
        variant='ghost'
        className='text-center text-lg font-medium capitalize'
        onClick={() => setIsOpen(true)}
      >
        {monthName} {year}
      </Button>
      <Button variant='ghost' size='icon' asChild>
        <Link href={getNextMonthLink()}>
          <ChevronRight size={4} />
        </Link>
      </Button>
      <YearMonthPicker
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        currentYearValue={year}
        currentMonthValue={monthName}
      />
    </div>
  );
}

export default DateSelector;
