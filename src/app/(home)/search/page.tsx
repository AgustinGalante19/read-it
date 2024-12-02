'use client';

import React, { ChangeEvent } from 'react';
import { GoogleBookItem } from '@/types/Book';
import { getBooks } from '@/services/GoogleBooks';
import { useDebounce } from '@uidotdev/usehooks';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import BookCard from '@/components/book/book-card';
import getAuthorsString from '@/lib/getAuthorsString';

function Search() {
  const [searchTerm, setSearchTerm] = React.useState('');
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
        results = data?.items || [];
      }

      setIsSearching(false);
      setResults(results);
    };

    searchBooks();
  }, [debouncedSearchTerm]);

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
      <span className='text-lg text-white font-semibold px-2'>
        Search Results
      </span>
      <ul className='p-2 rounded-b text-white w-full'>
        {results.map((book) => (
          <li key={book.id} className='my-4'>
            <BookCard
              book={{
                title: book.volumeInfo.title,
                authors: getAuthorsString(book.volumeInfo.authors),
                google_id: book.id,
                id: 0,
                inserted_at: new Date(),
                is_readed: false,
                page_count: book.volumeInfo.pageCount,
                publish_date: book.volumeInfo.publishedDate || '',
                thumbnail_url: book.volumeInfo.imageLinks?.thumbnail || '',
              }}
            />
          </li>
        ))}
      </ul>
    </form>
  );
}

export default Search;
