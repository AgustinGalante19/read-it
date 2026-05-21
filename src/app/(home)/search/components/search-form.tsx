'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useDebounce } from '@uidotdev/usehooks';
import { Book } from '@/types/Book';
import SearchResults from './search-results';
import RecentSearches from './recent-searches';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

function SearchForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const query = debouncedSearchTerm.trim();

    if (!query) {
      return;
    }

    const controller = new AbortController();

    const searchBooks = async () => {
      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/books/search?query=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error('Error searching books');
        }

        const data = (await response.json()) as Book[];
        setResults(data || []);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    searchBooks();

    return () => controller.abort();
  }, [debouncedSearchTerm]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (!value.trim()) {
      setResults(null);
      setIsSearching(false);
    }
  };

  return (
    <form className='container mx-auto p-4 animate-in fade-in-0 duration-500'>
      <InputGroup className='mb-2'>
        <InputGroupInput
          placeholder='Search Books...'
          value={searchTerm}
          onChange={handleChange}
        />
        <InputGroupAddon align='inline-start'>
          {isSearching ? <Spinner /> : <SearchIcon />}
        </InputGroupAddon>
      </InputGroup>
      <div className='min-h-52'>
        {results === null ? (
          <div className='animate-in fade-in-0 slide-in-from-left-4 duration-500'>
            <RecentSearches />
          </div>
        ) : (
          <div className='animate-in fade-in-0 slide-in-from-right-4 duration-500'>
            <span className='text-lg text-white font-semibold px-2 animate-in fade-in-0 slide-in-from-top-2 duration-300'>
              Search Results
            </span>
            <SearchResults books={results} />
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchForm;
