'use client';

import { generateYears } from '@/components/date-picker/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';

interface YearMonthPickerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentYearValue?: number;
  currentMonthValue?: string;
}

function YearMonthPicker({
  isOpen,
  onOpenChange,
  currentMonthValue,
  currentYearValue,
}: YearMonthPickerProps) {
  const [pickMode, setPickMode] = useState<'year' | 'month'>('month');

  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1);
      return date.toLocaleString('en-US', { month: 'long' });
    });
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-82 flex-col overflow-y-auto sm:max-w-82' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='text-sm text-start font-normal'>
            Select Date
          </DialogTitle>
        </DialogHeader>
        <div className='flex items-center'>
          <Button
            variant={pickMode === 'month' ? 'secondary' : 'ghost'}
            className='capitalize text-lg'
            onClick={() => setPickMode('month')}
          >
            {currentMonthValue}
          </Button>

          <Button
            variant={pickMode === 'year' ? 'secondary' : 'ghost'}
            className='text-lg'
            onClick={() => setPickMode('year')}
          >
            {currentYearValue}
          </Button>
        </div>

        <div>
          <span className='capitalize'>{pickMode}</span>
          <div className='mt-4 grid grid-cols-3 gap-2'>
            {pickMode === 'month'
              ? monthNames.map((monthName, index) => (
                  <Button
                    asChild
                    key={monthName}
                    variant={
                      currentMonthValue === monthName ? 'default' : 'ghost'
                    }
                    className='min-w-0 px-2 capitalize'
                  >
                    <Link
                      href={
                        pathname +
                        '?' +
                        createQueryString('month', (index + 1).toString())
                      }
                    >
                      <span className='truncate'>{monthName}</span>
                    </Link>
                  </Button>
                ))
              : generateYears(11).map((year) => (
                  <Button
                    key={year}
                    variant={year === currentYearValue ? 'default' : 'ghost'}
                    asChild
                  >
                    <Link
                      href={
                        pathname +
                        '?' +
                        createQueryString('year', year.toString())
                      }
                    >
                      {year}
                    </Link>
                  </Button>
                ))}
          </div>
        </div>
        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant={'ghost'}
            className='text-primary'
            onClick={() => onOpenChange(false)}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default YearMonthPicker;
