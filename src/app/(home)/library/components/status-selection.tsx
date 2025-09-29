'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Book } from '@/types/Book';
import React from 'react';
import Option from '../types/Option';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  options: Option[];
  bookStatus: Option;
  booksList: Book[];
  handleChangeStatus: (opt: Option) => void;
  isLoading: boolean;
}

function StatusSelection({
  options,
  bookStatus,
  booksList,
  handleChangeStatus,
  isLoading,
}: Props) {
  return (
    <section className='px-4'>
      {isLoading ? (
        <div className='flex items-center gap-4'>
          <Skeleton className='w-[130px] h-[36px] rounded-full' />
          <Skeleton className='w-[110px] h-[36px] rounded-full' />
          <Skeleton className='w-[120px] h-[36px] rounded-full' />
        </div>
      ) : (
        <Carousel className='w-full'>
          <CarouselContent className='-ml-1'>
            {options.map((opt) => (
              <div key={opt.label} className='pr-1'>
                <CarouselItem className='pl-1'>
                  <Button
                    variant='link'
                    className={cn(
                      'rounded-full',
                      opt.value === bookStatus.value
                        ? 'bg-primary text-primary-foreground'
                        : 'border bg-transparent border-gray-500'
                    )}
                    onClick={() => handleChangeStatus(opt)}
                  >
                    {opt.icon}
                    {opt.label}
                    {opt.value === bookStatus.value && (
                      <span className='text-xs p-1 rounded-full bg-background text-foreground text-center w-6 h-6'>
                        {booksList.length}
                      </span>
                    )}
                  </Button>
                </CarouselItem>
              </div>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </section>
  );
}

export default StatusSelection;
