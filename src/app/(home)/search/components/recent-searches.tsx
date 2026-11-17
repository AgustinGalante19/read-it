'use client';

import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { bookSearchService } from '@/services/SearchsService';
import type { RecentSearch } from '@/types/RecentSearch';
import SearchResults from './search-results';
import SearchSkeleton from './search-skeleton';

export default function RecentSearches() {
  const [books, setBooks] = useState<RecentSearch[] | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    let active = true;
    bookSearchService.getIDBBooks().then(
      (recentBooks) => { if (active) setBooks(recentBooks); },
      () => {
        if (!active) return;
        setBooks([]);
        toast.error('Could not load your recent history.');
      },
    );
    return () => { active = false; };
  }, []);

  async function clearHistory() {
    setIsClearing(true);
    try {
      await bookSearchService.removeIDBBooks();
      setBooks([]);
    } catch {
      toast.error('Could not clear your recent history.');
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <section aria-labelledby='recent-searches-title' aria-busy={books === null} className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1'>
        <h2 id='recent-searches-title' className='text-xl/7 font-medium'>Recently opened</h2>
        {books && books.length > 0 && (
          <Button
            type='button'
            variant='link'
            size='sm'
            onClick={clearHistory}
            disabled={isClearing}
          >
            Clear history
          </Button>
        )}
      </div>
      {books === null ? (
        <SearchSkeleton />
      ) : books.length > 0 ? (
        <SearchResults books={books} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'><History aria-hidden='true' /></EmptyMedia>
            <EmptyTitle>No recently opened books</EmptyTitle>
            <EmptyDescription>Books you open from search results will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
