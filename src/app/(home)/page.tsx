'use server';

import Topbar from '@/components/topbar';
import BooksList from '@/components/book/books-list';
import ShowAll from '@/components/book/show-all';
import Link from 'next/link';
import { getMyBooks } from '@/services/BookService';
import { BookStatus } from '@/types/Book';

export default async function Home() {
  const currentlyReading = await getMyBooks(BookStatus.READING);
  const readList = await getMyBooks(BookStatus.WANT_TO_READ);
  const readedBooks = await getMyBooks(BookStatus.READ);
  const allBooks = await getMyBooks(BookStatus.ALL);

  return (
    <main className='min-h-full'>
      <Topbar />
      <div className='container mx-auto p-4 space-y-8'>
        <section>
          {currentlyReading.data && currentlyReading.data.length > 0 ? (
            <>
              <ShowAll
                label='Currently Reading'
                readStatus={BookStatus.READING}
              />
              <BooksList
                books={currentlyReading.data}
                cardMode='vertical'
                opts={{ dragFree: true }}
                itemClassName='basis-1/3'
              />
            </>
          ) : (
            <div className='flex flex-col items-center mt-4 gap-2'>
              <span className='text-muted-foreground'>
                You&apos;re not reading any book...
              </span>
              <Link href='/search' className='text-accent-foreground underline'>
                Search one!
              </Link>
            </div>
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
            <div className='flex flex-col items-center mt-4 gap-2'>
              <span className='text-muted-foreground'>
                You don&apos;t have any books to read...
              </span>
              <Link href='/search' className='text-accent-foreground underline'>
                Search one!
              </Link>
            </div>
          )}
        </section>
        <section>
          <ShowAll label='Read' readStatus={BookStatus.READ} />
          {readedBooks.data && readedBooks.data.length > 0 ? (
            <BooksList books={readedBooks.data} opts={{ dragFree: true }} />
          ) : (
            <div className='flex flex-col items-center mt-4 gap-2'>
              <span className='text-muted-foreground'>
                No books read yet...
              </span>
              <Link href='/search' className='text-accent-foreground underline'>
                Start now!
              </Link>
            </div>
          )}
        </section>
        <section>
          <ShowAll label='All my Books' readStatus={BookStatus.ALL} />
          {allBooks.data && allBooks.data.length > 0 ? (
            <BooksList
              books={allBooks.data}
              cardMode='vertical'
              opts={{ dragFree: true }}
              itemClassName='basis-1/3'
            />
          ) : (
            <div className='flex flex-col items-center mt-4 gap-2'>
              <span className='text-muted-foreground'>
                You don&apos;t have any books in your library...
              </span>
              <Link href='/search' className='text-accent-foreground underline'>
                Search now!
              </Link>
            </div>
          )}
        </section>
        <div className='h-4'></div>
      </div>
    </main>
  );
}
