'use client';

import { Button } from '@/components/ui/button';
import { Book, GoogleBookItem } from '@/types/Book';
import { BadgeCheck, Bookmark, BookOpen, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BookMenu from './book-menu';
import { useState } from 'react';
import { addBook, removeFromLibrary } from '@/services/BookService';

function renderBookIcon(statusId: number) {
  switch (statusId) {
    case 1:
      return <Bookmark className='fill-primary-foreground' />;
    case 2:
      return <BookOpen className='fill-accent text-primary-foreground/80' />;
    case 3:
      return <BadgeCheck className='fill-accent text-primary-foreground/80' />;
    default:
      return null;
  }
}

function LibraryActions({
  dbBook: book,
  googleBook,
}: {
  dbBook: (Book & { ds_status: string }) | null | undefined;
  googleBook: GoogleBookItem | null;
}) {
  const { status: sessionStatus } = useSession();

  const { push } = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleAddBook = async () => {
    if (sessionStatus === 'unauthenticated') {
      push('/sign-in');
      return;
    }

    if (!googleBook) {
      return toast.error('book not found');
    }

    if (book?.id_book_status) {
      await removeFromLibrary(book.google_id);
      return;
    }

    const { data, success } = await addBook(googleBook);
    if (!success) {
      return toast.error(data);
    }
    return toast.success(data);
  };

  return (
    <div className='flex items-center gap-1'>
      {book ? (
        <div className='flex items-center gap-1'>
          <Button onClick={handleAddBook} className='custom-radius1'>
            {renderBookIcon(book.id_book_status)}
            {book.ds_status}
          </Button>
          <Button onClick={() => setIsOpen(true)} className='custom-radius2'>
            <ChevronDown />
          </Button>
        </div>
      ) : (
        <Button onClick={handleAddBook}>
          <Bookmark />
          Want to Read
        </Button>
      )}
      <BookMenu
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        book={book}
        googleBook={googleBook}
      />
    </div>
  );
}

export default LibraryActions;
