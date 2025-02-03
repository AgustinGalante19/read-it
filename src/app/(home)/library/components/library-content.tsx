'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { BookCheck, BookMarked, BookX, Calendar } from 'lucide-react';
import filterBooksByStatus from '@/lib/filterBooksByStatus';
import { getMyBooks } from '@/services/Library';
import BookCard from '@/components/book/book-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusSelection from './status-selection';
import { Book, BookStatus } from '@/types/Book';
import Option from '../types/Option';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import VerticalSkeleton from '@/components/book/vertical-skeleton';

const options: Option[] = [
  { id: 3, value: 'all', label: 'Saved Books', icon: <BookMarked size={18} /> },
  { id: 1, value: 'readed', label: 'Readed', icon: <BookCheck size={18} /> },
  { id: 2, value: 'notReaded', label: 'Not Readed', icon: <BookX size={18} /> },
];

export default function LibraryContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [bookStatus, setBookStatus] = useState<Option>(options[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = useSearchParams();

  const readStatus = searchParams.get('status');

  const router = useRouter();

  useEffect(() => {
    const getBooks = async () => {
      try {
        setIsLoading(true);
        const currentReadStatus: BookStatus =
          (readStatus as BookStatus) ?? 'all';
        const { result: allBooksResponse } = await getMyBooks('all');
        let booksResult = allBooksResponse;
        if (readStatus) {
          booksResult = filterBooksByStatus(
            allBooksResponse,
            currentReadStatus
          );
        }
        console.log(allBooksResponse);
        setBooksList(booksResult);
        setAllBooks(allBooksResponse);
        setBookStatus(
          options.find((el) => el.value === currentReadStatus) ?? options[0]
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getBooks();
  }, [readStatus]);

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
        <Button onClick={() => router.push('/calendar')}>
          <Calendar />
          Calendar
        </Button>
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
              <VerticalSkeleton key={i} />
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
