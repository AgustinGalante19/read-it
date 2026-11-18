'use client';

import type { ComponentProps } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BookCard from '@/components/book/book-card';
import { bookSearchService } from '@/services/SearchsService';
import type { Book } from '@/types/Book';
import { searchBookListClassName } from './search-layout';

type NavigateEvent = Parameters<NonNullable<ComponentProps<typeof BookCard>['onNavigate']>>[0];

export default function SearchResults({
  books,
  saveToHistory = false,
}: {
  books: Book[];
  saveToHistory?: boolean;
}) {
  const router = useRouter();

  async function openResult(event: NavigateEvent, book: Book) {
    event.preventDefault();
    try {
      await bookSearchService.addIDBBook(book);
    } catch {
      toast.error('Could not save this book to your recent history.');
    } finally {
      router.push('/book/' + book.google_id);
    }
  }

  return (
    <ul className={searchBookListClassName}>
      {books.map((book) => (
        <li key={book.google_id} className='min-w-0'>
          <BookCard
            book={book}
            mode='responsive'
            onNavigate={saveToHistory ? (event) => void openResult(event, book) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
