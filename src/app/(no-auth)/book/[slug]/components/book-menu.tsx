'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import getAuthorsString from '@/lib/getAuthorsString';
import { removeFromLibrary, updateBookStatus } from '@/services/Library';
import { Book, GoogleBookItem } from '@/types/Book';
import { BadgeCheck, Bookmark, BookOpen, Calendar, Trash } from 'lucide-react';
import { useState } from 'react';
import BookDatesModal from './book-dates-modal';

function BookMenu({
  isOpen,
  close,
  book,
  googleBook,
}: {
  isOpen: boolean;
  close: () => void;
  book: (Book & { ds_status: string }) | null;
  googleBook: GoogleBookItem | null;
}) {
  const [isLoading, setIsLoading] = useState({
    currentlyReading: false,
    wantToRead: false,
    read: false,
    remove: false,
  });

  const [isBookDateModalOpen, setIsBookDateModalOpen] = useState(false);

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
              {book?.title || googleBook?.volumeInfo.title}
            </DrawerTitle>
            <DrawerDescription className='text-left'>
              {getAuthorsString(googleBook?.volumeInfo.authors)}
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
      <BookDatesModal
        isOpen={isBookDateModalOpen}
        onClose={() => setIsBookDateModalOpen(false)}
        dbBook={book}
      />
    </>
  );
}

export default BookMenu;
