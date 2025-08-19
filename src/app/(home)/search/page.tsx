'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { GoogleBookItem } from '@/types/Book';
import { getBooks } from '@/services/GoogleBooks';
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import SearchResults from './components/search-results';
import RecentSearches from './components/recent-searches';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GoogleBookItem[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const searchBooks = async () => {
      if (debouncedSearchTerm === '') {
        return setResults(null);
      }

      let results: GoogleBookItem[] = [];
      setIsSearching(true);
      if (debouncedSearchTerm) {
        const data = await getBooks(debouncedSearchTerm);
        results = data?.items || [];
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
    <form className='container mx-auto p-4'>
      <div className='relative flex justify-between items-center my-4'>
        <Input
          placeholder='Search Books...'
          className='p-4'
          value={searchTerm}
          onChange={handleChange}
        />
        <div className='h-5 w-5 absolute top-[14px] right-5 transition-colors duration-200 focus:outline-hidden bg-transparent hover:bg-transparent'>
          <button>{isSearching ? '...' : <SearchIcon />}</button>
        </div>
      </div>
      {results === null ? (
        <RecentSearches />
      ) : (
        <>
          <span className='text-lg text-white font-semibold px-2'>
            Search Results
          </span>
          <SearchResults books={results} />
        </>
      )}
    </form>
  );
}

export default Search;
