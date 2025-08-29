'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Book } from '@/types/Book';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const imageSize = { width: 53, height: 77 };

function BooksGrid({ books }: { books: Book[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedBooks = showAll ? books : books.slice(0, 10);
  const shouldShowButton = books.length > 10;

  return (
    <div className='px-4 mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Books read</CardTitle>
          <CardDescription>
            You read <span className='text-primary'>{books.length}</span> books
          </CardDescription>
        </CardHeader>
        <CardContent className='flex  gap-2 items-center justify-start flex-wrap'>
          {displayedBooks.map((book) => (
            <TooltipProvider key={book.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/book/${book.id}`}>
                    <Image
                      alt={`${book.title} cover`}
                      height={imageSize.height}
                      width={imageSize.width}
                      src={book?.thumbnail_url || '/thumbnail-fallback.jpg'}
                      loading='lazy'
                      className={cn('max-h-[77px] h-[77px]')}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <span className='font-semibold'>{book.title}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {shouldShowButton && (
            <div className='w-full flex mt-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowAll(!showAll)}
                className='text-sm text-primary'
              >
                {showAll ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BooksGrid;
