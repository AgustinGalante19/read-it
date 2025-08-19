'use client';

import { Button } from '@/components/ui/button';
import { addBook } from '@/services/Library';
import { GoogleBookItem } from '@/types/Book';
import { Plus } from 'lucide-react';
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
    <Button onClick={handleAddBook}>
      <Plus />
      Add to Library
    </Button>
  );
}

export default AddBook;
