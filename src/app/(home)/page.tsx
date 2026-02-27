import BooksList from '@/components/book/books-list';
import ShowAll from '@/components/book/show-all';
import Link from 'next/link';
import { getMyBooks, getCurrentlyReadingStats } from '@/services/BookService';
import { BookStatus } from '@/types/Book';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Book, BookCheck, BookMarked, BookOpen } from 'lucide-react';
import CurrentlyReadingCard from '@/components/book/currently-reading-card';

export default async function Home() {
  const [currentlyReading, readList, readedBooks, allBooks] = await Promise.all(
    [
      getCurrentlyReadingStats(),
      getMyBooks(BookStatus.WANT_TO_READ),
      getMyBooks(BookStatus.READ),
      getMyBooks(BookStatus.ALL),
    ],
  );

  return (
    <main className='min-h-full'>
      <div className='container mx-auto p-4 space-y-8'>
        <section>
          {currentlyReading.data && currentlyReading.data.length > 0 ? (
            <>
              <ShowAll
                label='Currently Reading'
                readStatus={BookStatus.READING}
              />
              {currentlyReading.data!.map((book) => (
                <CurrentlyReadingCard key={book.google_id} book={book} />
              ))}
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <BookOpen />
                </EmptyMedia>
                <EmptyTitle>You&apos;re not reading any book...</EmptyTitle>
                <EmptyDescription>
                  Find a book to start reading! Or... Just START ONE!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href='/library'>Go to Library</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </section>
        <section>
          <ShowAll label='My Readlist' readStatus={BookStatus.WANT_TO_READ} />
          {readList.data && readList.data.length > 0 ? (
            <BooksList
              books={readList.data}
              cardMode='vertical'
              opts={{ dragFree: true }}
              itemClassName='basis-1/3'
            />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <BookMarked />
                </EmptyMedia>
                <EmptyTitle>
                  You don&apos;t have any books in your readlist...
                </EmptyTitle>
                <EmptyDescription>
                  What if you add some books to your readlist?
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href='/search'>Search books</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </section>
        <section>
          <ShowAll label='Read' readStatus={BookStatus.READ} />
          {readedBooks.data && readedBooks.data.length > 0 ? (
            <BooksList
              books={readedBooks.data}
              cardMode='vertical'
              opts={{ dragFree: true }}
            />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <BookCheck />
                </EmptyMedia>
                <EmptyTitle>Don&apos;t you have any read books?</EmptyTitle>
                <EmptyDescription>
                  Time to start reading and complete your first book!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href='/search'>Search books</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </section>
      </div>
    </main>
  );
}
