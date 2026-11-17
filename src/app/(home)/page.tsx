import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookCheck, BookMarked, BookOpen, CircleAlert } from 'lucide-react';
import BookCard from '@/components/book/book-card';
import CurrentlyReadingCard from '@/components/book/currently-reading-card';
import ShowAll from '@/components/book/show-all';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getCurrentlyReadingStats, getMyBooks } from '@/services/BookService';
import { Book, BookStatus } from '@/types/Book';
import type { Result } from '@/types/Result';
import {
  bookGridClassName,
  homePageClassName,
  readingGridClassName,
} from './_components/home-layout';
import RetryHomeButton from './_components/retry-home-button';

type BookSectionProps = {
  label: string;
  readStatus: BookStatus;
  result: Result<Book[]>;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: ReactNode;
};

function BookSection({
  label,
  readStatus,
  result: { data = [], success },
  emptyTitle,
  emptyDescription,
  emptyIcon,
}: BookSectionProps) {
  const isCurrentlyReading = readStatus === BookStatus.READING;

  return (
    <section aria-label={label} className='space-y-2'>
      <ShowAll label={label} readStatus={readStatus} heading='h2' />
      {success && data.length > 0 ? (
        <ul className={isCurrentlyReading ? readingGridClassName : bookGridClassName}>
          {data.map((book) => (
            <li key={book.id} className='min-w-0'>
              {isCurrentlyReading ? (
                <CurrentlyReadingCard book={book} />
              ) : (
                <BookCard book={book} mode='cover' />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Empty className='items-start gap-4 rounded-xl bg-surface-container p-4 text-left md:p-6'>
          <EmptyHeader className='items-start text-left'>
            <EmptyMedia variant='icon'>{success ? emptyIcon : <CircleAlert />}</EmptyMedia>
            <EmptyTitle>{success ? emptyTitle : 'Could not load books'}</EmptyTitle>
            <EmptyDescription>
              {success ? emptyDescription : 'Try loading this section again.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className='w-auto max-w-none items-start'>
            {success ? (
              <Button
                asChild
                variant='outline'
                className='border-outline bg-transparent text-primary shadow-none transition-colors duration-150 hover:bg-white/8 hover:text-primary active:scale-100 active:bg-white/12 max-[600px]:h-12'
              >
                <Link href={isCurrentlyReading ? '/library' : '/search'}>
                  {isCurrentlyReading ? 'Go to Library' : 'Search books'}
                </Link>
              </Button>
            ) : (
              <RetryHomeButton />
            )}
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}

export default async function Home() {
  const [currentlyReading, readlist, readBooks] = await Promise.all([
    getCurrentlyReadingStats(),
    getMyBooks(BookStatus.WANT_TO_READ),
    getMyBooks(BookStatus.READ),
  ]);

  return (
    <main className={homePageClassName}>
      <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>Home</h1>
      <BookSection
        label='Currently Reading'
        readStatus={BookStatus.READING}
        result={currentlyReading}
        emptyTitle='No books in progress'
        emptyDescription='Choose a book from your library to start reading.'
        emptyIcon={<BookOpen />}
      />
      <BookSection
        label='My Readlist'
        readStatus={BookStatus.WANT_TO_READ}
        result={readlist}
        emptyTitle='Your readlist is empty'
        emptyDescription='Save books you want to read later.'
        emptyIcon={<BookMarked />}
      />
      <BookSection
        label='Read'
        readStatus={BookStatus.READ}
        result={readBooks}
        emptyTitle='No finished books yet'
        emptyDescription='Books you mark as finished will appear here.'
        emptyIcon={<BookCheck />}
      />
    </main>
  );
}
