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
import { EreaderWarning } from './ereader-warning';

function GeneralStats({
  book,
  page,
  tag,
  activity,
}: Omit<
  Stats,
  'last6MonthsReadedBooks' | 'dailyActivity' | 'hourlyActivity'
>) {
  return (
    <section className='px-4'>
      <Carousel className='w-full'>
        <CarouselContent className='-ml-1'>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px] h-[150px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-secondary-foreground'>
                      Books read
                    </CardTitle>
                    <Book />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold text-primary'>
                    {book.count}
                  </span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-pretty text-surface-foreground pb-4 truncate'>
                    Last book read:
                    <Link
                      href={`/book/${book.lastRead.googleId}`}
                      className='text-pretty ml-1 underline text-primary'
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
              <Card className='w-[250px] h-[150px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-secondary-foreground'>
                      7 Day Activity
                    </CardTitle>
                    <EreaderWarning />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold text-primary'>
                    {activity.week.pages} pages
                  </span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-surface-foreground pb-4'>
                    {Math.round(activity.week.duration / 60)} mins read this
                    week
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          </div>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px] h-[150px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-secondary-foreground'>
                      30 Day Activity
                    </CardTitle>
                    <EreaderWarning />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold text-primary'>
                    {activity.month.pages} pages
                  </span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-surface-foreground pb-4'>
                    {Math.floor(activity.month.duration / 3600)}h{' '}
                    {Math.round((activity.month.duration % 3600) / 60)}m read
                    this month
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          </div>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px] h-[150px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-secondary-foreground'>
                      Page count
                    </CardTitle>
                    <BookOpen />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold text-primary'>
                    +{page.totalPageCount}
                  </span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-surface-foreground pb-4'>
                    {page.lastMonthCount} pages last month
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          </div>
          <div className='pr-1'>
            <CarouselItem className='pl-1'>
              <Card className='w-[250px] h-[150px]'>
                <CardHeader className='p-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-secondary-foreground'>
                      Tags count
                    </CardTitle>
                    <Tag />
                  </div>
                </CardHeader>
                <CardContent className='px-4 pb-2'>
                  <span className='text-2xl font-bold text-primary'>
                    {tag.tagCount}
                  </span>
                </CardContent>
                <CardFooter className='pb-0'>
                  <span className='text-xs text-surface-foreground pb-4'>
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
