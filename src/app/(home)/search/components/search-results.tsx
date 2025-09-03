'use client';

import BookCard from '@/components/book/book-card';
import { mapGoogleBookToBook } from '@/services/adapters/BookAdapter';
import { bookSearchService } from '@/services/SearchsService';
import { Book, GoogleBookItem } from '@/types/Book';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

function SearchResults({ books }: { books: GoogleBookItem[] }) {
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
      {books.map((book) => {
        const mappedBook = mapGoogleBookToBook(book);
        return (
          <li
            key={book.id}
            className='my-4'
            onClick={() => handleClickSearch(mappedBook)}
          >
            <BookCard book={mappedBook} />
          </li>
        );
      })}
    </ul>
  );
}

export default React.memo(SearchResults);
