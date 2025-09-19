import { Book, ExtendedBookData } from '@/types/Book';
import googleBooksService from '../GoogleBooksService';
import { mapGoogleBooksArray } from '../adapters/BookAdapter';

class BooksSearcher {
  async getByQuery(query: string): Promise<Book[]> {
    const booksResponse = await googleBooksService.getBooksByQuery(query);
    return mapGoogleBooksArray(booksResponse.items);
  }

  async getById(id: string): Promise<ExtendedBookData> {
    const bookResponse = await googleBooksService.getBookById(id);
    return mapGoogleBooksArray([bookResponse])[0];
  }
  async getBooksBySubject(subject: string): Promise<Book[]> {
    const booksResponse = await googleBooksService.getBooksBySubject(subject);
    return booksResponse ? mapGoogleBooksArray(booksResponse.items) : [];
  }
}

const booksSearcher = new BooksSearcher();

export default booksSearcher;
