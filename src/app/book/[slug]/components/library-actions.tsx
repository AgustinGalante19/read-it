'use client';

import { Button } from '@/components/ui/button';
import { removeFromLibrary, updateReadStatus } from '@/services/Library';
import { Book } from '@/types/Book';
import { BookCheck, BookX, X } from 'lucide-react';
import { toast } from 'sonner';

function LibraryActions({ book }: { book: Book }) {
  const handleMarkAsReaded = async () => {
    await updateReadStatus(book.google_id, !book.is_readed);
    toast.success(`Book marked as ${!book.is_readed ? 'readed' : 'to read'}`);
  };

  const handleRemoveFromLibrary = async () => {
    await removeFromLibrary(book.google_id);
    toast.success(`${book.title} removed from library`);
  };

  return (
    <div className='flex items-center gap-4'>
      <Button size='icon' onClick={handleMarkAsReaded}>
        {book.is_readed ? <BookX /> : <BookCheck />}
      </Button>
      <Button
        size='icon'
        variant='outline'
        className='border-destructive hover:bg-red-400/30'
        onClick={handleRemoveFromLibrary}
      >
        <X color='#f44336' />
      </Button>
    </div>
  );
}

export default LibraryActions;
