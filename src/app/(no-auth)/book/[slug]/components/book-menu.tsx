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
import { Book, GoogleBookItem } from '@/types/Book';
import { BadgeCheck, Bookmark, BookOpen, Calendar, Trash } from 'lucide-react';

function BookMenu({
  isOpen,
  close,
  book,
  googleBook,
}: {
  isOpen: boolean;
  close: () => void;
  book: Book | null;
  googleBook: GoogleBookItem | null;
}) {
  return (
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
          <Button className='w-full justify-start rounded-lg' variant={'ghost'}>
            <Bookmark />
            Want to Read
          </Button>
          <Button className='w-full justify-start rounded-lg' variant={'ghost'}>
            <BookOpen />
            Currently Reading
          </Button>
          <Button className='w-full justify-start rounded-lg' variant={'ghost'}>
            <BadgeCheck />
            Read
          </Button>
          {book && (
            <Button className='w-full justify-start' variant={'destructive'}>
              <Trash />
              Remove
            </Button>
          )}
          <Separator />
          <Button variant={'ghost'} className='w-full justify-start rounded-lg'>
            <Calendar />
            Dates read
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default BookMenu;
