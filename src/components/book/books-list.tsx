import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselOptions,
} from '../ui/carousel';
import BookCard from './book-card';
import { Book } from '@/types/Book';
import { cn } from '@/lib/utils';

interface Props {
  books: Book[];
  cardMode?: 'horizontal' | 'vertical';
  opts?: CarouselOptions;
  itemClassName?: string;
}

function BooksList({
  books,
  cardMode = 'horizontal',
  opts,
  itemClassName,
}: Props) {
  return (
    <Carousel opts={opts} className='w-full'>
      <CarouselContent className='-ml-2'>
        {books.map((book, i) => (
          <div key={`${book.id}-${book.title}-${i}`} className='pr-2'>
            <CarouselItem className={cn('pl-2', itemClassName)}>
              <BookCard book={book} mode={cardMode} />
            </CarouselItem>
          </div>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default BooksList;
