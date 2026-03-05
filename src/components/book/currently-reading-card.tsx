'use client';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';
import { BadgeCheck } from 'lucide-react';
import { Progress } from '../ui/progress';
import Link from 'next/link';
import { Book, BookStatus } from '@/types/Book';
import { updateBookStatus } from '@/services/BookService';
import datesHelper from '@/services/helpers/DatesHelper';

interface CurrentylReadingCardProps {
  book: Book;
}

function CurrentylReadingCard({ book }: CurrentylReadingCardProps) {
  const pagesRead = book.book_total_read_pages ?? 0;
  const totalPages = book.page_count;
  const progress =
    totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;
  const readingTime = book.book_total_read_time ?? 0;

  return (
    <Card className='mt-2'>
      <CardContent className='pt-6'>
        <div className='flex flex-col min-[360px]:flex-row gap-4'>
          <div className='shrink-0 self-center min-[360px]:self-start'>
            <Link href={`/book/${book.google_id}`}>
              <Image
                src={book.thumbnail_url}
                alt={book.title}
                width={126}
                height={178}
                className='rounded-xl'
              />
            </Link>
          </div>
          <div className='flex flex-col justify-between w-full'>
            <div className='w-full'>
              <h3 className='font-bold text-xl'>{book.title}</h3>
              <span className='text-sm text-muted-foreground italic'>
                {book.authors}
              </span>
            </div>
            <div className='flex flex-col py-2 w-full'>
              <div className='grid grid-cols-2 w-full text-sm'>
                <span className='text-primary'>{progress}% completed</span>
                <span className='text-muted-foreground'>
                  {pagesRead} / {totalPages} pages
                </span>
              </div>
              <span className='text-muted-foreground text-sm  mb-1'>
                Reading time: {datesHelper.formatSecondsToDuration(readingTime)}
              </span>
              <Progress value={progress} />
            </div>
            <Button
              startIcon={<BadgeCheck />}
              className='w-full'
              onClick={() => updateBookStatus(BookStatus.READ, book.google_id)}
            >
              Mark as finished
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CurrentylReadingCard;
