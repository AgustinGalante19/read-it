import Topbar from '@/components/topbar';
import { getMyBooks } from '@/services/Library';
import BooksList from '@/components/book/books-list';
import ShowAll from '@/components/book/show-all';
import Link from 'next/link';

export default async function Home() {
  const readList = await getMyBooks('notReaded');
  const readedBooks = await getMyBooks('readed');
  const allBooks = await getMyBooks('all');

  return (
    <main>
      <Topbar />
      <div className='container mx-auto p-4 space-y-8'>
        <section>
          <ShowAll label='My Readlist' readStatus='notReaded' />
          {readList.result.length > 0 ? (
            <>
              <BooksList
                books={readList.result}
                cardMode='vertical'
                opts={{ dragFree: true }}
                itemClassName='basis-1/3'
              />
            </>
          ) : (
            <div className='flex flex-col items-center mt-4 gap-2'>
              <span className='text-gray-300'>
                You don&apos;t have any book to read...
              </span>
              <Link href='/search' className='underline'>
                Search one
              </Link>
            </div>
          )}
        </section>
        <section>
          <ShowAll label='Readed' readStatus='readed' />
          <BooksList books={readedBooks.result} opts={{ dragFree: true }} />
        </section>
        <section>
          <ShowAll label='All my Books' readStatus='all' />
          <BooksList
            books={allBooks.result}
            cardMode='vertical'
            opts={{ dragFree: true }}
            itemClassName='basis-1/3'
          />
        </section>
      </div>
    </main>
  );
}
