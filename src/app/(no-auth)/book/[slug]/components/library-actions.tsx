'use client';

import { Button } from '@/components/ui/button';
import { addBook } from '@/services/Library';
import { Book, GoogleBookItem } from '@/types/Book';
import { Bookmark, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BookMenu from './book-menu';
import { useState } from 'react';

function LibraryActions({
  dbBook: book,
  googleBook,
}: {
  dbBook: Book | null;
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
    const { result, status } = await addBook(googleBook);
    if (!status) {
      return toast.error(result);
    }
    return toast.success(result);
  };

  return (
    <div className='flex items-center gap-1'>
      {book ? (
        <Button onClick={() => setIsOpen(!isOpen)}>
          <div className='flex items-center gap-1'>
            {/* Cambiar segun estado actual del libro */}
            <Bookmark />
            Want to Read
          </div>
          <ChevronDown />
        </Button>
      ) : (
        <>
          <Button className='custom-radius1' onClick={handleAddBook}>
            <Bookmark />
            Want to Read
          </Button>
          <Button className='custom-radius2' onClick={() => setIsOpen(!isOpen)}>
            <ChevronDown />
          </Button>
        </>
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
