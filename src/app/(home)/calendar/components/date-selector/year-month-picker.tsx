'use client';

import { generateYears } from '@/components/date-picker/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';

function YearMonthPicker({
  isOpen,
  onOpenChange,
  currentMonthValue,
  currentYearValue,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentYearValue?: number;
  currentMonthValue?: string;
}) {
  const [pickMode, setPickMode] = useState<'year' | 'month'>('month');

  // Generar nombres de meses según la configuración regional del usuario
  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1);
      return date.toLocaleString(undefined, { month: 'long' });
    });
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='w-[328px] h-[400px] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-sm text-start font-normal'>
            Select Date
          </DialogTitle>
        </DialogHeader>

        {/* Month-Year picker */}
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

        {/* CONTENT */}
        <div>
          <span className='capitalize'>{pickMode}</span>
          <div className='grid grid-cols-3 gap-2 mt-4'>
            {pickMode === 'month'
              ? monthNames.map((monthName, index) => (
                  <Button
                    key={monthName}
                    variant={
                      currentMonthValue === monthName ? 'default' : 'ghost'
                    }
                    className='capitalize'
                    onClick={() => {
                      router.push(
                        pathname +
                          '?' +
                          createQueryString('month', (index + 1).toString())
                      );
                    }}
                  >
                    {monthName}
                  </Button>
                ))
              : generateYears(11).map((year) => (
                  <Button
                    key={year}
                    variant={year === currentYearValue ? 'default' : 'ghost'}
                    onClick={() => {
                      router.push(
                        pathname +
                          '?' +
                          createQueryString('year', year.toString())
                      );
                    }}
                  >
                    {year}
                  </Button>
                ))}
          </div>
        </div>

        {/* Footer */}
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
