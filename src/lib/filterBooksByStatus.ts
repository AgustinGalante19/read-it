import { Book, BookStatus } from '@/types/Book';

export default function filterBooksByStatus(
  booksList: Book[],
  status: BookStatus
): Book[] {
  let books;
  switch (status) {
    case 'readed':
      books = booksList.filter((book) => book.is_readed);
      break;
    case 'notReaded':
      books = booksList.filter((book) => !book.is_readed);
      break;
    default:
      books = booksList;
      break;
  }
  return books;
}
