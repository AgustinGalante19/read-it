import { GoogleBookItem, GoogleBooksResponse } from '@/types/Book';

const BASE_GOOGLE_API_URL = 'https://www.googleapis.com/books/v1';

class GoogleBooksService {
  async getBooksByQuery(query: string): Promise<GoogleBooksResponse> {
    const request = await fetch(
      `${BASE_GOOGLE_API_URL}/volumes?q=${query}&printType=books`,
      {
        cache: 'force-cache',
      }
    );
    const booksResponse = await request.json();
    return booksResponse;
  }

  async getBookById(id: string): Promise<GoogleBookItem> {
    const request = await fetch(`${BASE_GOOGLE_API_URL}/volumes/${id}`, {
      cache: 'force-cache',
    });
    const booksResponse = await request.json();
    return booksResponse;
  }

  async getBooksBySubject(subject: string): Promise<GoogleBooksResponse> {
    const bookResponse = await this.getBooksByQuery(
      `subject:${subject}&orderBy=relevance`
    );
    return bookResponse;
  }
}
const googleBooksService = new GoogleBooksService();
export default googleBooksService;
