'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import BookCard from '@/components/book/book-card';
import { bookSearchService } from '@/services/SearchsService';
import { Book } from '@/types/Book';

function SearchResults({ books }: { books: Book[] }) {
  const router = useRouter();

  const handleClickSearch = useCallback(
    async (book: Book) => {
      try {
        const recentSearchesResult = await bookSearchService.getIDBBooks();
        const alreadyExists = recentSearchesResult.find(
          (el) => el.google_id === book.google_id
        );
        if (alreadyExists) {
          return;
        }
        await bookSearchService.addIDBBook(book);
      } catch (err) {
        console.log('Error on save data: ', err);
      } finally {
        router.push(`/book/${book.google_id}`);
      }
    },
    [router]
  );

  return (
    <ul className='p-2 rounded-b text-white w-full'>
      {books.map((book, index) => (
        <li
          key={book.google_id}
          className='my-4 animate-in fade-in-0 slide-in-from-bottom-4 zoom-in-95 duration-400
                     transition-all hover:scale-[1.03] hover:translate-y-[-3px] hover:shadow-xl
                     cursor-pointer rounded-lg hover:bg-surface-container/30 active:scale-[0.98]'
          style={{
            animationDelay: `${index * 150}ms`,
            animationFillMode: 'both',
          }}
          onClick={() => handleClickSearch(book)}
        >
          <div className='p-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5'>
            <BookCard book={book} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default React.memo(SearchResults);
