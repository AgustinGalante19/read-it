'use client';

import { useEffect, useState, useTransition } from 'react';
import { BookCheck, BookIcon, BookMarked, BookX, Calendar, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Book, BookStatus } from '@/types/Book';
import type { Result } from '@/types/Result';
import Option from '../types/Option';
import BookCard from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getMyBooks } from '@/services/BookService';
import bookHelper from '@/services/helpers/BookHelper';
import StatusSelection from './status-selection';
import { LibraryBooksSkeleton } from './page-fallback';
import { libraryGridClassName } from './library-layout';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

const options: Option[] = [
  { id: 1, value: BookStatus.READ, label: 'Read', icon: <BookCheck /> },
  { id: 3, value: BookStatus.ALL, label: 'Saved Books', icon: <BookMarked /> },
  { id: 4, value: BookStatus.READING, label: 'Reading', icon: <BookIcon /> },
  { id: 2, value: BookStatus.WANT_TO_READ, label: 'Want to Read', icon: <BookX /> },
];

export default function LibraryContent() {
  const [library, setLibrary] = useState<Result<Book[]> | null>(null);
  const [bookStatus, setBookStatus] = useState<Option>(options[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const readStatus = useSearchParams().get('status');
  const isLoading = library === null || isPending;

  useEffect(() => {
    let active = true;
    startTransition(async () => {
      try {
        const response = await getMyBooks(BookStatus.ALL);
        if (!active) return;
        setLibrary(response);
        setBookStatus(options.find((option) => option.value === Number(readStatus || BookStatus.READ)) ?? options[0]);
      } catch {
        if (active) setLibrary({ success: false });
      }
    });
    return () => { active = false; };
  }, [readStatus, retryCount]);

  const booksList = bookHelper
    .filterBooksByStatus(library?.data ?? [], bookStatus.value)
    .filter((book) => book.title.toLowerCase().includes(searchTerm.trim().toLowerCase()));

  const handleChangeStatus = (newOption: Option) => {
    setBookStatus(newOption);
    setSearchTerm('');
  };

  return (
    <>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>My Library</h1>
        <Button asChild>
          <Link href='/calendar'><Calendar aria-hidden='true' />Calendar</Link>
        </Button>
      </header>
      <div className='flex min-w-0 flex-col gap-4 min-[1024px]:flex-row min-[1024px]:items-end min-[1024px]:justify-between min-[1024px]:gap-6'>
        <StatusSelection
          isLoading={isLoading}
          bookStatus={bookStatus}
          count={booksList.length}
          handleChangeStatus={handleChangeStatus}
          options={options}
        />
        <div className='flex w-full flex-col gap-1 min-[1024px]:w-64 min-[1024px]:shrink-0 min-[1280px]:w-72'>
          <Label htmlFor='library-title-search'>Title</Label>
          <InputGroup className='h-11 min-[1024px]:h-9'>
            <InputGroupInput
              id='library-title-search'
              type='search'
              placeholder='Search by Title'
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              disabled={isLoading}
            />
            <InputGroupAddon align='inline-start'><BookIcon aria-hidden='true' /></InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <section aria-label='Library books' aria-busy={isLoading}>
        {isLoading ? (
          <LibraryBooksSkeleton />
        ) : !library?.success ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'><CircleAlert aria-hidden='true' /></EmptyMedia>
              <EmptyTitle>Couldn’t load your library</EmptyTitle>
              <EmptyDescription>Try loading your books again.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type='button' variant='outline' onClick={() => setRetryCount((count) => count + 1)}>
                Try again
              </Button>
            </EmptyContent>
          </Empty>
        ) : booksList.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'><BookIcon aria-hidden='true' /></EmptyMedia>
              <EmptyTitle>{searchTerm.trim() ? 'No matching titles' : 'No books in this view'}</EmptyTitle>
              <EmptyDescription>
                {searchTerm.trim() ? 'Try a different title.' : 'Choose another reading status to browse your books.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className={libraryGridClassName}>
            {booksList.map((book) => (
              <li key={book.id} className='min-w-0'>
                <BookCard book={book} mode='cover' />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
