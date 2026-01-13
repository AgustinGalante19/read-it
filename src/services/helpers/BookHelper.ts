import { Book, BookStatus } from '@/types/Book';

class BookHelper {
  getBookAuthors(authors: string[] | string | undefined) {
    if (!authors) return 'Not Provided';

    if (typeof authors !== 'string') return authors?.join(' ');

    return authors;
  }

  filterBooksByStatus(booksList: Book[], status: BookStatus): Book[] {
    let books;
    switch (status) {
      case BookStatus.READ:
        books = booksList.filter((book) => book.id_book_status === 3);
        books = books.sort((a, b) => {
          const dateA = a.finish_date ? new Date(a.finish_date) : new Date(0);
          const dateB = b.finish_date ? new Date(b.finish_date) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
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
}

const bookHelper = new BookHelper();

export default bookHelper;
