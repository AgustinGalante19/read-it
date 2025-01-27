'use client';

import BookCard from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import filterBooksByStatus from '@/lib/filterBooksByStatus';
import { cn } from '@/lib/utils';
import { getMyBooks } from '@/services/Library';
import { Book, BookStatus } from '@/types/Book';
import { BookCheck, BookMarked, BookX, Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';

interface Option {
  id: number;
  value: BookStatus;
  icon: React.ReactNode;
  label: string;
}

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
      <section className='px-4'>
        <Carousel className='w-full'>
          <CarouselContent className='-ml-1'>
            {options.map((opt) => (
              <div key={opt.label} className='pr-1'>
                <CarouselItem className='pl-1'>
                  <Button
                    variant='link'
                    className={cn(
                      'rounded-full',
                      opt.value === bookStatus.value
                        ? 'bg-primary text-cgray'
                        : 'border bg-transparent border-gray-500'
                    )}
                    onClick={() => handleChangeStatus(opt)}
                  >
                    {opt.icon}
                    {opt.label}
                    {opt.value === bookStatus.value && (
                      <span className='text-xs p-1 rounded-full bg-background text-foreground text-center w-6 h-6'>
                        {booksList.length}
                      </span>
                    )}
                  </Button>
                </CarouselItem>
              </div>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
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
      {isLoading ? (
        <div className='h-[300px] flex items-center justify-center w-full'>
          <Loader2 className='animate-spin' size={32} />
        </div>
      ) : (
        <section>
          <ul className='grid grid-cols-2 gap-2 py-4'>
            {booksList.map((book) => (
              <li key={book.id} className='mx-auto w-fit'>
                <BookCard book={book} mode='vertical' />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
