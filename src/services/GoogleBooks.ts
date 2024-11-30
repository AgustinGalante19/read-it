import { GoogleBooksResponse } from '@/types/Book';

const BASE_GOOGLE_API_URL = 'https://www.googleapis.com/books/v1';

export async function getBooks(query: string): Promise<GoogleBooksResponse> {
  const request = await fetch(`${BASE_GOOGLE_API_URL}/volumes?q=${query}`);
  const booksResponse = await request.json();
  return booksResponse;
}
