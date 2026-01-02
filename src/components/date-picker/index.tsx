import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DatePickerProps, DateRange } from './types';
import { MONTHNAMES } from './constants';
import {
  formatDateRange,
  generateCalendarDays,
  generateYears,
  isDayInRange,
  isDaySelected,
  isToday,
} from './utils';
import { cn } from '@/lib/utils';
import { Book } from '@/types/Book';

function DatePicker({
  isOpen,
  onOpenChange,
  onSubmit,
  defaultValue,
  book,
  isWorking = false,
}: DatePickerProps & {
  book:
    | (Book & {
        ds_status: string;
      })
    | null
    | undefined;
  isWorking?: boolean;
}) {
  const [dateRange, setDateRange] = useState<DateRange>(
    () =>
      defaultValue || {
        from: undefined,
        to: undefined,
      }
  );
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Si hay un defaultValue, inicializar el mes actual con el mes de 'from' o 'to'
    if (defaultValue?.from) {
      return new Date(
        defaultValue.from.getFullYear(),
        defaultValue.from.getMonth(),
        1
      );
    } else if (defaultValue?.to) {
      return new Date(
        defaultValue.to.getFullYear(),
        defaultValue.to.getMonth(),
        1
      );
    }
    return new Date();
  });

  const calendarDays = useMemo(
    () => generateCalendarDays(currentMonth),
    [currentMonth]
  );

  const yearOptions = useMemo(() => generateYears(10), []);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Manejar selección de fecha
  const handleDateSelect = (selectedDate: Date) => {
    if (!dateRange.from) {
      // Primera selección: establecer 'from'
      setDateRange({ from: selectedDate, to: undefined });
    } else if (!dateRange.to) {
      // Segunda selección: establecer 'to'
      if (selectedDate.getTime() === dateRange.from.getTime()) {
        // Si se clickea la misma fecha, establecer 'to' igual a 'from'
        setDateRange({ from: dateRange.from, to: selectedDate });
      } else {
        // Asegurar que 'from' sea siempre anterior a 'to'
        const from =
          selectedDate < dateRange.from ? selectedDate : dateRange.from;
        const to =
          selectedDate < dateRange.from ? dateRange.from : selectedDate;
        setDateRange({ from, to });
      }
    } else {
      // Ya hay un rango completo: reiniciar con nueva selección
      setDateRange({ from: selectedDate, to: undefined });
    }
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-[328px] h-[512px] flex flex-col'
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className='text-sm text-start font-normal'>
            {book?.title} - {book?.authors}
          </DialogTitle>
          <DialogDescription className='sr-only'>
            Select date range
          </DialogDescription>
        </DialogHeader>

        {/* Header con rango de fechas seleccionado */}
        <div>
          <span className='text-2xl font-semibold'>
            {formatDateRange(dateRange)}
          </span>
        </div>

        {/* Month picker */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Select
              value={currentMonth.getMonth().toString()}
              onValueChange={(value) => handleMonthChange(parseInt(value))}
            >
              <SelectTrigger size='sm' className='w-fit'>
                <SelectValue placeholder='Select month' />
              </SelectTrigger>
              <SelectContent>
                {MONTHNAMES.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={currentMonth.getFullYear().toString()}
              onValueChange={(value) => handleYearChange(parseInt(value))}
            >
              <SelectTrigger size='sm' className='w-fit'>
                <SelectValue placeholder='Select year' />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant={'ghost'} size={'icon'} onClick={goToPreviousMonth}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button variant={'ghost'} size={'icon'} onClick={goToNextMonth}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Weekday Description */}
        <div className='grid grid-cols-7 text-center'>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            S
          </div>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            M
          </div>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            T
          </div>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            W
          </div>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            T
          </div>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            F
          </div>
          <div className='font-medium text-xs text-secondary-foreground py-2'>
            S
          </div>
        </div>

        {/* Day picker */}
        <div className='grid grid-cols-7 gap-1 flex-1'>
          {calendarDays.map((dayData, index) => (
            <div key={index} className='flex items-center justify-center'>
              <Button
                variant={
                  isDaySelected(dayData, dateRange) ? 'default' : 'ghost'
                }
                size={'sm'}
                className={cn('w-8 h-8 rounded-full text-sm relative', {
                  'bg-secondary text-primary hover:bg-primary/20': isDayInRange(
                    dayData,
                    dateRange
                  ),
                  'hover:bg-secondary':
                    !isDaySelected(dayData, dateRange) &&
                    !isDayInRange(dayData, dateRange),
                  'text-primary border border-primary/50':
                    isToday(dayData) &&
                    !isDaySelected(dayData, dateRange) &&
                    !isDayInRange(dayData, dateRange),
                  'text-muted-foreground hover:bg-secondary':
                    !dayData.isCurrentMonth,
                  'text-primary-foreground bg-primary':
                    !dayData.isCurrentMonth &&
                    isDaySelected(dayData, dateRange),
                })}
                onClick={() => {
                  handleDateSelect(dayData.date);
                  // Si se selecciona un día de otro mes, cambiar al mes correspondiente
                  if (!dayData.isCurrentMonth) {
                    setCurrentMonth(
                      new Date(
                        dayData.date.getFullYear(),
                        dayData.date.getMonth(),
                        1
                      )
                    );
                  }
                }}
              >
                {dayData.day}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant={'ghost'}
            className='text-primary'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={'ghost'}
            className='text-primary'
            onClick={() => onSubmit(dateRange)}
            isLoading={isWorking}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DatePicker;
