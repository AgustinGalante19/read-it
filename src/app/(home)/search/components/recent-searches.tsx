'use client';

import BookCard from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { bookSearchService } from '@/services/SearchsService';
import { Book } from '@/types/Book';
import React, { useCallback } from 'react';

function RecentSearches() {
  const [recentSearches, setRecentSearches] = React.useState<Book[]>([]);

  React.useEffect(() => {
    const getRecentSearches = async () => {
      const results = await bookSearchService.getIDBBooks();
      setRecentSearches(results);
    };
    getRecentSearches();
  }, []);

  const handleRemoveRecenSearches = useCallback(async () => {
    await bookSearchService.removeIDBBooks();
    setRecentSearches([]);
  }, []);

  return (
    <>
      <div className='flex justify-between items-center animate-in fade-in-0 slide-in-from-top-2 duration-300'>
        <span className='text-lg text-white font-semibold px-2'>
          Recent Searches
        </span>
        <Button
          className='underline transition-all duration-200 hover:scale-105 hover:text-destructive'
          onClick={handleRemoveRecenSearches}
          variant='link'
        >
          Clear all
        </Button>
      </div>
      <ul className='p-2 rounded-b text-white w-full'>
        {recentSearches.map((book, index) => (
          <li
            key={book.google_id}
            className='my-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-300 transition-all hover:scale-[1.02] hover:translate-y-[-2px] cursor-pointer rounded-lg'
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
            onClick={() => null}
          >
            <div className=' rounded-lg transition-all duration-200'>
              <BookCard book={book} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default React.memo(RecentSearches);
