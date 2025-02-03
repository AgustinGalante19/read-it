import { getMyBooks } from '@/services/Library';
import BooksCalendar from './components/books-calendar';

async function CalendarPage() {
  const books = await getMyBooks('readed');
  return <BooksCalendar books={books.result} />;
}

export default CalendarPage;
