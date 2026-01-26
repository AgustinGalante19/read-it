'use client';

import { Button } from '@/components/ui/button';
import { Book, BookStatusDictionary } from '@/types/Book';
import { BadgeCheck, Bookmark, BookOpen, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BookMenu from './book-menu';
import { useState } from 'react';
import { addBook, removeFromLibrary } from '@/services/BookService';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group';
import { useSession } from '@/lib/auth/auth-client';
import { BookHighlightPreview } from '@/types/BookHighlight';
import HighlightsModal from '@/components/book/highlights-modal';

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
  dbBook,
  googleBook,
  bookhighlights,
}: {
  dbBook: Book | null | undefined;
  googleBook: Book | null;
  bookhighlights: BookHighlightPreview[];
}) {
  const { data: sessionData } = useSession();

  const { push } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isHighlightsModalOpen, setIsHighlightsModalOpen] = useState(false);

  const handleAddBook = async () => {
    if (!sessionData) {
      push('/sign-in');
      return;
    }

    if (!googleBook) {
      return toast.error('book not found');
    }

    if (dbBook?.id_book_status) {
      await removeFromLibrary(dbBook.google_id);
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
      {dbBook ? (
        <ButtonGroup>
          <Button onClick={handleAddBook}>
            {renderBookIcon(dbBook.id_book_status)}
            {
              BookStatusDictionary[
                dbBook.id_book_status as keyof typeof BookStatusDictionary
              ]
            }
          </Button>
          <ButtonGroupSeparator />
          <Button onClick={() => setIsOpen(true)}>
            <ChevronDown />
          </Button>
        </ButtonGroup>
      ) : (
        <Button onClick={handleAddBook}>
          <Bookmark />
          Want to Read
        </Button>
      )}
      <BookMenu
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        book={dbBook}
        googleBook={googleBook}
        handleOpenHighlightsModal={() => setIsHighlightsModalOpen(true)}
      />
      <HighlightsModal
        book={dbBook}
        isOpen={isHighlightsModalOpen}
        onOpenChange={setIsHighlightsModalOpen}
        highlights={bookhighlights}
      />
    </div>
  );
}

export default LibraryActions;
