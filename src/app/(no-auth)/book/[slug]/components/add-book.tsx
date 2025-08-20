'use client';

import { Button } from '@/components/ui/button';
import { addBook } from '@/services/Library';
import { GoogleBookItem } from '@/types/Book';
import { Bookmark, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddBook({ book }: { book: GoogleBookItem }) {
  const { status: sessionStatus } = useSession();

  const { push } = useRouter();

  const handleAddBook = async () => {
    if (sessionStatus === 'unauthenticated') {
      push('/sign-in');
      return;
    }

    const { result, status } = await addBook(book);
    if (!status) {
      return toast.error(result);
    }
    return toast.success(result);
  };

  return (
    <div className='flex items-center gap-1'>
      <Button className='custom-radius1' onClick={handleAddBook}>
        <Bookmark />
        Want to Read
      </Button>
      <Button className='custom-radius2'>
        <ChevronDown />
      </Button>
    </div>
  );
}

export default AddBook;
