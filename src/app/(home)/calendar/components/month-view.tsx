import { Book } from '@/types/Book';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from 'date-fns';
import { BookItem } from './book-item';

export default function MonthView({
  month,
  books,
}: {
  month: Date;
  books: Book[];
}) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className='bg-background border rounded-lg overflow-hidden'>
      <h3 className='text-xl font-medium p-3 bg-muted text-center'>
        {format(month, 'MMMM yyyy')}
      </h3>
      <div className='grid grid-cols-7 gap-px bg-border'>
        {['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='bg-background p-2 text-sm text-muted-foreground text-center'
          >
            {day}
          </div>
        ))}
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className='bg-background p-2' />
        ))}
        {days.map((day) => {
          const booksForDay = books.filter((book) =>
            isSameDay(book.readed_at, day)
          );
          const book = booksForDay[0];

          return (
            <div
              key={day.toString()}
              className='bg-background p-2 min-h-[100px] border-t relative group'
            >
              <div className='text-sm mb-1'>{format(day, 'd')}</div>
              {book && <BookItem book={book} booksForDay={booksForDay} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
