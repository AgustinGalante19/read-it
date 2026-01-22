'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useDebounce } from '@uidotdev/usehooks';
import { Book } from '@/types/Book';
import booksSearcher from '@/services/repositories/BooksSearcher';
import SearchResults from './components/search-results';
import RecentSearches from './components/recent-searches';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const searchBooks = async () => {
      if (debouncedSearchTerm === '') {
        return setResults(null);
      }

      let results: Book[] = [];
      setIsSearching(true);
      if (debouncedSearchTerm) {
        const data = await booksSearcher.getByQuery(debouncedSearchTerm);
        results = data || [];
      }

      setIsSearching(false);
      setResults(results);
    };

    searchBooks();
  }, [debouncedSearchTerm]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form className='container mx-auto p-4 animate-in fade-in-0 duration-500'>
      <InputGroup className='mb-2'>
        <InputGroupInput
          placeholder='Search Books...'
          value={searchTerm}
          onChange={handleChange}
        />
        <InputGroupAddon align='inline-end'>
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

export default Search;
