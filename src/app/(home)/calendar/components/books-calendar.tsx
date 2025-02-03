'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Book } from '@/types/Book';
import MonthView from './month-view';

export default function Calendar({ books }: { books: Book[] }) {
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
