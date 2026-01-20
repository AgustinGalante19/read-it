'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useDebounce } from '@uidotdev/usehooks';
import { Book } from '@/types/Book';
import booksSearcher from '@/services/repositories/BooksSearcher';
import { Input } from '@/components/ui/input';
import SearchResults from './components/search-results';
import RecentSearches from './components/recent-searches';

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
      <div className='relative flex justify-between items-center my-4'>
        <Input
          placeholder='Search Books...'
          className='p-4 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg focus:border-primary/50'
          value={searchTerm}
          onChange={handleChange}
        />
        <div className='h-5 w-5 absolute top-[14px] right-5 transition-all duration-200 focus:outline-hidden bg-transparent hover:bg-transparent'>
          <button className='transition-transform duration-200 hover:scale-110'>
            {isSearching ? (
              <div className='animate-spin text-primary'>⏳</div>
            ) : (
              <SearchIcon className='transition-colors duration-200 hover:text-primary' />
            )}
          </button>
        </div>
      </div>
      <div className='min-h-[200px]'>
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
