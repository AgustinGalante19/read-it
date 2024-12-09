'use client';

import BookCard from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { getIDBBooks, removeIDBBooks } from '@/services/localBooksDb';
import { Book } from '@/types/Book';
import React, { useCallback } from 'react';

function RecentSearches() {
  const [recentSearches, setRecentSearches] = React.useState<Book[]>([]);

  React.useEffect(() => {
    const getRecentSearches = async () => {
      const results = await getIDBBooks();
      setRecentSearches(results);
    };
    getRecentSearches();
  }, []);

  const handleRemoveRecenSearches = useCallback(async () => {
    await removeIDBBooks();
    setRecentSearches([]);
  }, []);

  return (
    <>
      <div className='flex justify-between items-center'>
        <span className='text-lg text-white font-semibold px-2'>
          Recent Searches
        </span>
        <Button
          className='underline'
          onClick={handleRemoveRecenSearches}
          variant='link'
        >
          Clear all
        </Button>
      </div>
      <ul className='p-2 rounded-b text-white w-full'>
        {recentSearches.map((book) => (
          <li key={book.google_id} className='my-4' onClick={() => null}>
            <BookCard book={book} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default React.memo(RecentSearches);
