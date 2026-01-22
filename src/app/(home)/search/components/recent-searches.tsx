'use client';

import BookCard from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { bookSearchService } from '@/services/SearchsService';
import { RecentSearch } from '@/types/RecentSearch';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Search } from 'lucide-react';
function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
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
    <div>
      <div className='flex justify-between items-center animate-in fade-in-0 slide-in-from-top-2 duration-300'>
        <span className='text-lg text-white font-semibold px-2'>
          Recent Searches
        </span>
        <Button
          className='underline transition-all duration-200 hover:scale-105 hover:text-destructive'
          onClick={handleRemoveRecenSearches}
          variant='link'
          type='button'
        >
          Clear all
        </Button>
      </div>
      {recentSearches.length > 0 ? (
        <ul className='p-2 rounded-b text-white w-full'>
          {recentSearches.map((book, index) => (
            <li
              key={book.google_id}
              className='my-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-300 transition-all hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer rounded-lg'
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
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Search />
            </EmptyMedia>
            <EmptyTitle>No recent searchs</EmptyTitle>
            <EmptyDescription>
              Start searching for books to see them here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

export default memo(RecentSearches);
