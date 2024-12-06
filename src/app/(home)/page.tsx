import Topbar from '@/components/topbar';
import { getMyBooks } from '@/services/Library';
import BooksList from '@/components/book/books-list';
import ShowAll from '@/components/book/show-all';

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
          <BooksList
            books={readList.result}
            cardMode='vertical'
            opts={{ dragFree: true }}
            itemClassName='basis-1/3'
          />
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
