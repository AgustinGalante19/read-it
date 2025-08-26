'use server';

import { getMyBooks } from '@/services/BookService';
import BooksCalendar from './components/books-calendar';

async function CalendarPage() {
  const books = await getMyBooks('readed');

  if (!books.data) {
    return <div>No books found</div>;
  }

  return <BooksCalendar books={books.data} />;
}

export default CalendarPage;
