'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, BookStatus } from '@/types/Book';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BookCover from '@/components/book/book-cover';

export default function BooksGrid({ books }: { books: Book[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedBooks = showAll ? books : books.slice(0, 12);

  return (
    <section aria-labelledby='completed-books-title'>
      <Card>
        <CardHeader className='p-5 pb-4'>
          <CardTitle><h2 id='completed-books-title'>Books read</h2></CardTitle>
          <CardDescription>{books.length.toLocaleString('en-US')} completed books in your library</CardDescription>
        </CardHeader>
        <CardContent className='px-5 pb-5'>
          {books.length ? (
            <TooltipProvider>
              <ul id='completed-books' className='flex flex-wrap gap-3'>
                {displayedBooks.map((book) => (
                  <li key={book.id} className='w-14 min-[600px]:w-16'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/book/${book.google_id}`} aria-label={`${book.title} by ${book.authors}`} className='block rounded-sm'>
                          <BookCover src={book.thumbnail_url} sizes='64px' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent><p className='max-w-64'>{book.title}</p></TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </TooltipProvider>
          ) : <p className='text-sm/6 text-muted-foreground'>Your completed books will appear here.</p>}
        </CardContent>
        {books.length > 12 && (
          <CardFooter className='px-5 pb-5'>
            <Button variant='ghost' size='sm' aria-controls='completed-books' aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show less' : 'Show more'}
            </Button>
          </CardFooter>
        )}
        {!books.length && (
          <CardFooter className='px-5 pb-5'>
            <Button variant='outline' asChild><Link href={`/library?status=${BookStatus.READ}`}>Go to Library</Link></Button>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
