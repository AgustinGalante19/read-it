import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Stats from '@/types/Stats';
import { Book, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function GeneralStats({
  book,
  page,
  tag,
}: Omit<Stats, 'last6MonthsReadedBooks'>) {
  return (
    <section className='px-4'>
      <Carousel className='w-full'>
        <CarouselContent className='-ml-1'>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Books readed</CardTitle>
                    <Book />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold'>{book.count}</span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-gray-400 pb-4'>
                    Last book readed:
                    <Link
                      href={`/book/${book.lastRead.googleId}`}
                      className='truncate ml-1 underline text-primary'
                    >
                      {book.lastRead.title}
                    </Link>
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          </div>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Page count</CardTitle>
                    <BookOpen />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold'>
                    +{page.totalPageCount}
                  </span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-gray-400 pb-4'>
                    {page.lastMonthCount} pages last month
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          </div>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Tags count</CardTitle>
                    <Tag />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold'>{tag.tagCount}</span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-gray-400 pb-4'>
                    Last genre read {tag.lastTagReaded}
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          </div>
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export default GeneralStats;
