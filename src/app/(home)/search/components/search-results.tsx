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
      {books.map((book) => (
        <li
          key={book.google_id}
          className='my-4'
          onClick={() => handleClickSearch(book)}
        >
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}

export default React.memo(SearchResults);
