'use client';

import React, { ChangeEvent, useState } from 'react';
import { Book, GoogleBookItem } from '@/types/Book';
import { getBooks } from '@/services/GoogleBooks';
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import BookCard from '@/components/book/book-card';
import mapBookObject from '@/lib/mapBookObject';
import { useRouter } from 'next/navigation';
import {
  addIDBBook,
  getIDBBooks,
  removeIDBBooks,
} from '@/services/localBooksDb';

function Search() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState<GoogleBookItem[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [recentSearches, setRecentSearches] = useState<Book[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const router = useRouter();

  React.useEffect(() => {
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

  React.useEffect(() => {
    const getRecentSearches = async () => {
      const results = await getIDBBooks();
      setRecentSearches(results);
    };
    getRecentSearches();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClickSearch = async (book: Book) => {
    try {
      const recentSearchesResult = await getIDBBooks();
      const alreadyExists = recentSearchesResult.find(
        (el) => el.google_id === book.google_id
      );
      if (alreadyExists) {
        return;
      }
      addIDBBook(book);
    } catch (err) {
      console.log('Error on save data: ', err);
    } finally {
      router.push(`/book/${book.google_id}`);
    }
  };

  const handleRemoveRecenSearches = async () => {
    await removeIDBBooks();
    setRecentSearches([]);
  };

  return (
    <form className='container mx-auto p-4'>
      <div className='relative flex justify-between items-center my-4'>
        <Input
          placeholder='Search Books...'
          className='p-4'
          onChange={handleChange}
        />
        <div className='h-5 w-5 absolute top-[14px] right-5 transition-colors duration-200 focus:outline-none bg-transparent hover:bg-transparent'>
          {isSearching ? '...' : <SearchIcon />}
        </div>
      </div>
      {results === null ? (
        <>
          <div className='flex justify-between items-center'>
            <span className='text-lg text-white font-semibold px-2'>
              Recent Searches
            </span>
            <button
              type='button'
              className='underline text-sm font-semibold text-gray-400'
              onClick={handleRemoveRecenSearches}
            >
              Clear all
            </button>
          </div>
          <ul className='p-2 rounded-b text-white w-full'>
            {recentSearches.map((book) => (
              <li
                key={book.google_id}
                className='my-4'
                onClick={() => handleClickSearch(book)}
              >
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <span className='text-lg text-white font-semibold px-2'>
            Search Results
          </span>
          <ul className='p-2 rounded-b text-white w-full'>
            {results.map((book) => {
              const mappedBook = mapBookObject(book);
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
        </>
      )}
    </form>
  );
}

export default Search;
