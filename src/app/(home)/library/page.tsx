'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { BookCheck, BookMarked, BookX } from 'lucide-react';
import filterBooksByStatus from '@/lib/filterBooksByStatus';
import { getMyBooks } from '@/services/Library';
import BookCard from '@/components/book/book-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import StatusSelection from './components/status-selection';
import { Book } from '@/types/Book';
import Option from './types/Option';

const options: Option[] = [
  { id: 3, value: 'all', label: 'Saved Books', icon: <BookMarked size={18} /> },
  { id: 1, value: 'readed', label: 'Readed', icon: <BookCheck size={18} /> },
  { id: 2, value: 'notReaded', label: 'Not Readed', icon: <BookX size={18} /> },
];

export default function LibraryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [bookStatus, setBookStatus] = useState<Option>(options[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getBooks = async () => {
      try {
        setIsLoading(true);
        const { result } = await getMyBooks('all');
        setBooksList(result);
        setAllBooks(result);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getBooks();
  }, []);

  const onSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    if (!value) {
      const books = filterBooksByStatus(allBooks, bookStatus.value);
      setBooksList(books);
      return;
    }
    const newBooksList = booksList.filter((book) =>
      book.title.toLowerCase().includes(value.toLowerCase())
    );
    setBooksList(newBooksList);
  };

  const handleChangeStatus = (newOption: Option) => {
    setBookStatus(newOption);
    const newBooks = filterBooksByStatus(allBooks, newOption.value);
    setSearchTerm('');
    setBooksList(newBooks);
  };

  return (
    <div>
      <header className='w-full flex p-4 justify-between items-center container mx-auto'>
        <span className='text-2xl font-bold text-white flex items-center gap-2 underline decoration-primary'>
          My Library
        </span>
      </header>
      <StatusSelection
        isLoading={isLoading}
        bookStatus={bookStatus}
        booksList={booksList}
        handleChangeStatus={handleChangeStatus}
        options={options}
      />
      <section className='px-4 mt-2'>
        <Label>
          Title
          <Input
            placeholder='Search by title'
            value={searchTerm}
            onChange={onSearchTermChange}
          />
        </Label>
      </section>
      <section>
        {isLoading ? (
          <div className='128x172 grid grid-cols-2 gap-2 py-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-[272px] w-[128px] space-y-1 mx-auto'>
                <Skeleton className='w-full h-[190px]' />
                <Skeleton className='w-[128px] h-[22px]' />
                <Skeleton className='w-[128px] h-[22px]' />
                <div className='flex items-center gap-2'>
                  <Skeleton className='w-[128px] h-[16px]' />
                  <Skeleton className='w-[50px] h-[16px]' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className='grid grid-cols-2 gap-2 py-4'>
            {booksList.map((book) => (
              <li key={book.id} className='mx-auto w-fit'>
                <BookCard book={book} mode='vertical' />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
