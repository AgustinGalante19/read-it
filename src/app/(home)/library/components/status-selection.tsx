'use client';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type Option from '../types/Option';

interface Props {
  options: Option[];
  bookStatus: Option;
  count: number;
  handleChangeStatus: (option: Option) => void;
  isLoading: boolean;
}

export default function StatusSelection({
  options,
  bookStatus,
  count,
  handleChangeStatus,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div aria-hidden='true' className='flex min-w-0 flex-wrap gap-2'>
        <Skeleton className='h-9 w-20 rounded-full' />
        <Skeleton className='h-9 w-28 rounded-full' />
        <Skeleton className='h-9 w-24 rounded-full' />
      </div>
    );
  }

  return (
    <Carousel
      aria-label='Reading status'
      className='min-w-0 flex-1'
      opts={{ align: 'start', breakpoints: { '(min-width: 1024px)': { active: false } } }}
    >
      <CarouselContent className='-ml-2 min-[1024px]:flex-wrap min-[1024px]:gap-y-2'>
        {options.map((option) => {
          const selected = option.value === bookStatus.value;
          return (
            <CarouselItem key={option.value} className='basis-auto pl-2'>
              <Button
                type='button'
                variant={selected ? 'default' : 'outline'}
                aria-pressed={selected}
                onClick={() => handleChangeStatus(option)}
                startIcon={option.icon}
              >
                {option.label}
                {selected && <Badge variant='secondary' className='min-w-6 justify-center rounded-full px-1.5'>{count}</Badge>}
              </Button>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
