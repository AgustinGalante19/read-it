import { getMyBooks } from '@/services/Library';
import BooksCalendar from './components/books-calendar';

async function CalendarPage() {
  const books = await getMyBooks('readed');
  return (
    <div className='container mx-auto'>
      <BooksCalendar books={books.result} />
    </div>
  );
}

export default CalendarPage;
