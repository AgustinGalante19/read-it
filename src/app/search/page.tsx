'use client';

import React, { ChangeEvent } from 'react';
import { GoogleBookItem } from '@/types/Book';
import { getBooks } from '@/services/GoogleBooks';
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from '@/components/ui/input';

function Search() {
  const [searchTerm, setSearchTerm] = React.useState('js');
  const [results, setResults] = React.useState<GoogleBookItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    const searchBooks = async () => {
      let results: GoogleBookItem[] = [];
      setIsSearching(true);
      if (debouncedSearchTerm) {
        const data = await getBooks(debouncedSearchTerm);
        console.log(data);
        results = data?.items || [];
        console.log('TODO: call google books api', results);
      }

      setIsSearching(false);
      setResults(results);
    };

    searchBooks();
  }, [debouncedSearchTerm]);

  return (
    <form className='container mx-auto'>
      <div className='relative flex justify-between items-center'>
        <Input
          placeholder='Search Books...'
          className='rounded-t'
          onChange={handleChange}
        />
        {/* <div className='h-5 w-5 absolute top-[6.5px] right-4 transition-colors duration-200 focus:outline-none bg-transparent hover:bg-transparent'>
          {isSearching ? '...' : <Search />}
        </div> */}
        {results.length > 0 && (
          <ul className='absolute bg-cgray p-2 rounded-b text-white top-9 overflow-y-auto w-full max-h-48'>
            {results.map((book) => (
              <li key={book.id} className='text-primary my-2'>
                {book.volumeInfo.authors.join(' ')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export default Search;
