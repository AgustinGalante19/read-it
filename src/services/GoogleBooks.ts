'use server';

import { GoogleBookItem, GoogleBooksResponse } from '@/types/Book';

const BASE_GOOGLE_API_URL = 'https://www.googleapis.com/books/v1';

export async function getBooks(query: string): Promise<GoogleBooksResponse> {
  const request = await fetch(
    `${BASE_GOOGLE_API_URL}/volumes?q=${query}&printType=books`,
    {
      cache: 'force-cache',
    }
  );
  const booksResponse = await request.json();
  return booksResponse;
}

export async function getBook(id: string): Promise<GoogleBookItem> {
  const request = await fetch(`${BASE_GOOGLE_API_URL}/volumes/${id}`, {
    cache: 'force-cache',
  });
  const booksResponse = await request.json();
  return booksResponse;
}

export async function getBooksBySubject(
  subject: string
): Promise<GoogleBooksResponse> {
  const bookResponse = await getBooks(`subject:${subject}&orderBy=relevance`);
  return bookResponse;
}
