'use client';

import { Button } from '@/components/ui/button';
import { addBook } from '@/services/Library';
import { GoogleBookItem } from '@/types/Book';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

function AddBook({ book }: { book: GoogleBookItem }) {
  const handleAddBook = async () => {
    const { result, status } = await addBook(book);
    if (!status) {
      return toast.error(result);
    }
    return toast.success(result);
  };

  return (
    <Button size='icon' className='rounded-full' onClick={handleAddBook}>
      <Plus />
    </Button>
  );
}

export default AddBook;
