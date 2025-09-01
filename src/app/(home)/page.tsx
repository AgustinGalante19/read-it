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
          {currentlyReading.data && (
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
          )}
        </section>
        <section>
          <ShowAll label='My Readlist' readStatus={BookStatus.WANT_TO_READ} />
          {readList.data ? (
            <BooksList
              books={readList.data}
              cardMode='vertical'
              opts={{ dragFree: true }}
              itemClassName='basis-1/3'
            />
          ) : (
            <div className='flex flex-col items-center mt-4 gap-2'>
              <span className='text-gray-300'>
                You don&apos;t have any books to read...
              </span>
              <Link href='/search' className='underline'>
                Search one
              </Link>
            </div>
          )}
        </section>
        <section>
          <ShowAll label='Read' readStatus={BookStatus.READ} />
          {readedBooks.data ? (
            <BooksList books={readedBooks.data} opts={{ dragFree: true }} />
          ) : (
            <span className='text-gray-300'>No books read yet...</span>
          )}
        </section>
        <section>
          <ShowAll label='All my Books' readStatus={BookStatus.ALL} />
          {allBooks.data ? (
            <BooksList
              books={allBooks.data}
              cardMode='vertical'
              opts={{ dragFree: true }}
              itemClassName='basis-1/3'
            />
          ) : (
            <span className='text-gray-300'>
              You don&apos;t have any books in your library...
            </span>
          )}
        </section>
        <div className='h-4'></div>
      </div>
    </main>
  );
}
