import BooksList from '@/components/book/books-list';
import ShowAll from '@/components/book/show-all';
import { Book } from '@/types/Book';
import React from 'react';

function LastbooksList({ books }: { books: Book[] }) {
  return (
    <section className='px-4'>
      <ShowAll label='Latest reads' readStatus='readed' />
      <BooksList books={books} opts={{ dragFree: true }} />
    </section>
  );
}
export default LastbooksList;
