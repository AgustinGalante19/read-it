'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, Bookmark, BookOpen, Calendar, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Book } from '@/types/Book';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import {
  removeFromLibrary,
  updateBookDates,
  updateBookStatus,
} from '@/services/BookService';
import DatePicker from '@/components/date-picker';
import { DateRange } from '@/components/date-picker/types';
import datesHelper from '@/services/helpers/DatesHelper';
import bookHelper from '@/services/helpers/BookHelper';

interface BookMenuProps {
  isOpen: boolean;
  close: () => void;
  book: (Book & { ds_status: string }) | null | undefined;
  googleBook: Book | null;
}

function BookMenu({ isOpen, close, book, googleBook }: BookMenuProps) {
  const [isLoading, setIsLoading] = useState({
    currentlyReading: false,
    wantToRead: false,
    read: false,
    remove: false,
  });

  const [isBookDateModalOpen, setIsBookDateModalOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const defaultDateRange: DateRange = useMemo(
    () => ({
      from: book?.start_date ? new Date(book.start_date) : undefined,
      to: book?.finish_date ? new Date(book.finish_date) : undefined,
    }),
    [book]
  );

  const handleAction = async (
    action: keyof typeof isLoading,
    newStatus: number
  ) => {
    if (!book) return;
    setIsLoading((prev) => ({ ...prev, [action]: true }));
    await updateBookStatus(newStatus, book?.google_id);
    setIsLoading((prev) => ({ ...prev, [action]: false }));
    close();
  };

  const handleSaveDates = async (range: DateRange) => {
    if (!book) return;
    setIsWorking(true);

    const { error, data, success } = await updateBookDates(book.google_id, {
      from: range?.from ? datesHelper.getDateNormalized(range.from) : null,
      to: range?.to ? datesHelper.getDateNormalized(range.to) : null,
    });

    if (!success) {
      toast.error(error);
      return;
    }

    toast.success(data);
    setIsWorking(false);
    setIsBookDateModalOpen(false);
  };

  const handleRemove = async () => {
    if (!book) return;
    setIsLoading((prev) => ({ ...prev, remove: true }));
    await removeFromLibrary(book?.google_id);
    setIsLoading((prev) => ({ ...prev, remove: false }));
    close();
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={close}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className='text-lg font-semibold flex items-center gap-2'>
              {book?.title || googleBook?.title}
            </DrawerTitle>
            <DrawerDescription className='text-left'>
              {bookHelper.getBookAuthors(googleBook?.authors)}
            </DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-2 px-4 pb-4 items-start'>
            <Button
              className='w-full justify-start rounded-lg'
              isLoading={isLoading.wantToRead}
              onClick={() => handleAction('wantToRead', 1)}
              variant={book?.id_book_status === 1 ? 'secondary' : 'ghost'}
            >
              <Bookmark
                className={book?.id_book_status === 1 ? 'fill-accent' : ''}
              />
              Want to Read
            </Button>
            <Button
              className='w-full justify-start rounded-lg'
              isLoading={isLoading.currentlyReading}
              onClick={() => handleAction('currentlyReading', 2)}
              variant={book?.id_book_status === 2 ? 'secondary' : 'ghost'}
            >
              <BookOpen
                className={book?.id_book_status === 2 ? 'fill-accent' : ''}
              />
              Currently Reading
            </Button>
            <Button
              className='w-full justify-start rounded-lg'
              isLoading={isLoading.read}
              onClick={() => handleAction('read', 3)}
              variant={book?.id_book_status === 3 ? 'secondary' : 'ghost'}
            >
              <BadgeCheck
                className={book?.id_book_status === 3 ? 'fill-accent' : ''}
              />
              Read
            </Button>
            {book && (
              <Button
                className='w-full justify-start'
                variant={'destructive'}
                isLoading={isLoading.remove}
                onClick={handleRemove}
              >
                <Trash />
                Remove
              </Button>
            )}
            <Separator />
            <Button
              variant={'ghost'}
              className='w-full justify-start rounded-lg'
              onClick={() => setIsBookDateModalOpen(true)}
            >
              <Calendar />
              Dates read
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <DatePicker
        isOpen={isBookDateModalOpen}
        onOpenChange={setIsBookDateModalOpen}
        onSubmit={handleSaveDates}
        book={book}
        defaultValue={defaultDateRange}
        isWorking={isWorking}
      />
    </>
  );
}

export default BookMenu;
