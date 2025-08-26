import { Book, BookStatus } from '@/types/Book';

export default function filterBooksByStatus(
  booksList: Book[],
  status: BookStatus
): Book[] {
  let books;
  switch (status) {
    case 'readed':
      books = booksList.filter((book) => book.id_book_status === 3);
      break;
    case 'reading':
      books = booksList.filter((book) => book.id_book_status === 2);
      break;
    case 'wantTo':
      books = booksList.filter((book) => book.id_book_status === 1);
      break;
    default:
      books = booksList;
      break;
  }
  return books;
}
