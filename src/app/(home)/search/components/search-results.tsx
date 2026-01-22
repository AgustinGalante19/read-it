'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import BookCard from '@/components/book/book-card';
import { bookSearchService } from '@/services/SearchsService';
import { Book } from '@/types/Book';
import { toast } from 'sonner';

function SearchResults({ books }: { books: Book[] }) {
  const router = useRouter();

  const handleClickSearch = useCallback(
    async (book: Book) => {
      try {
        await bookSearchService.addIDBBook(book);
      } catch {
        toast.error('Error saving recent search');
      } finally {
        router.push(`/book/${book.google_id}`);
      }
    },
    [router],
  );

  return (
    <ul className='p-2 rounded-b text-white w-full'>
      {books.map((book, index) => (
        <li
          key={book.google_id}
          className='my-2 cursor-pointer rounded-lg'
          style={{
            animationDelay: `${index * 150}ms`,
            animationFillMode: 'both',
          }}
          onClick={() => handleClickSearch(book)}
        >
          <div className='rounded-lg transition-all duration-300 hover:bg-linear-to-r hover:from-primary/5 hover:to-accent/5'>
            <BookCard book={book} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default React.memo(SearchResults);
