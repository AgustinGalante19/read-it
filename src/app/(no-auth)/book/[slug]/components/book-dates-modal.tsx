'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { parseLocalDate } from '@/lib/date-utils';
import { Book } from '@/types/Book';
import { toast } from 'sonner';
import { updateBookDates } from '@/services/BookService';

interface BookDatesModal {
  dbBook: Book | null | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDatesModal({
  dbBook,
  isOpen,
  onClose,
}: BookDatesModal) {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);
  const [isWorking, setIsWorking] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handleSave = async () => {
    if (!dbBook) return;

    setIsWorking(true);
    const { error, data, success } = await updateBookDates(dbBook.google_id, {
      from: range?.from ? range.from.toISOString().split('T')[0] : null,
      to: range?.to ? range.to.toISOString().split('T')[0] : null,
    });

    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(data);
    setIsWorking(false);
    onClose();
  };

  React.useEffect(() => {
    const loadDefaults = () => {
      if (dbBook) {
        const from = parseLocalDate(dbBook.start_date);
        const to = parseLocalDate(dbBook.finish_date);
        setRange({ from, to });
      }
    };

    if (isOpen) {
      loadDefaults();
      setPopoverOpen(false); // Asegurar que el popover esté cerrado
    }

    return () => {
      setRange(undefined);
      setPopoverOpen(false);
    };
  }, [isOpen, dbBook]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          // Prevenir cierre si el click es dentro del popover
          const target = e.target as Element;
          if (target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-start'>Read Dates</DialogTitle>
          <DialogDescription className='text-start'>
            Set your book start and finish dates
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-between font-normal rounded-md mx-auto bg-transparent'
                onClick={(e) => {
                  e.stopPropagation();
                  setPopoverOpen(true);
                }}
              >
                {range?.from || range?.to
                  ? `${range.from ? range.from.toLocaleDateString() : ''}${
                      range.from && range.to ? ' - ' : ''
                    }${range.to ? range.to.toLocaleDateString() : ''}`
                  : 'Select date'}
                <CalendarIcon className='text-primary' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='start'
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => {
                e.stopPropagation();
                setPopoverOpen(false);
              }}
            >
              <Calendar
                mode='range'
                selected={range}
                captionLayout='dropdown'
                onSelect={(selectedRange) => {
                  setRange(selectedRange);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <div className='flex justify-end gap-2'>
            <DialogClose asChild>
              <Button variant={'ghost'} className='text-primary'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant={'ghost'}
              className='text-primary'
              onClick={handleSave}
              isLoading={isWorking}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
