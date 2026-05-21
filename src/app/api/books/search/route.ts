import { NextResponse } from 'next/server';
import booksSearcher from '@/services/repositories/BooksSearcher';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  if (!query) {
    return NextResponse.json([]);
  }

  const books = await booksSearcher.getByQuery(query);

  return NextResponse.json(books);
}
