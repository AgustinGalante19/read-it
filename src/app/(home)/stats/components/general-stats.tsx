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
import { Book, BookOpen, Tag } from 'lucide-react';
import React from 'react';

interface Props {
  tag: { tagCount: number; lastTagReaded: string };
  book: { bookCount: number; lastBookReaded: string };
  page: { totalPageCount: number; lastMonthCount: number };
}

function GeneralStats({ book, page, tag }: Props) {
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
                  <span className='text-2xl font-bold'>{book.bookCount}</span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-gray-400 pb-4 truncate'>
                    Last book readed: {book.lastBookReaded}
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
