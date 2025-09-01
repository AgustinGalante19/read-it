import { Book, BookStatus } from '@/types/Book';

export default function filterBooksByStatus(
  booksList: Book[],
  status: BookStatus
): Book[] {
  let books;
  switch (status) {
    case BookStatus.READ:
      books = booksList.filter((book) => book.id_book_status === 3);
      break;
    case BookStatus.READING:
      books = booksList.filter((book) => book.id_book_status === 2);
      break;
    case BookStatus.WANT_TO_READ:
      books = booksList.filter((book) => book.id_book_status === 1);
      break;
    default:
      books = booksList;
      break;
  }
  return books;
}
