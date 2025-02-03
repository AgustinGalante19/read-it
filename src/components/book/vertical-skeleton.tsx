import React from 'react';
import { Skeleton } from '../ui/skeleton';

function VerticalSkeleton() {
  return (
    <div className='h-[272px] w-[128px] space-y-1 mx-auto'>
      <Skeleton className='w-full h-[190px]' />
      <Skeleton className='w-[128px] h-[22px]' />
      <Skeleton className='w-[128px] h-[22px]' />
      <div className='flex items-center gap-2'>
        <Skeleton className='w-[128px] h-[16px]' />
        <Skeleton className='w-[50px] h-[16px]' />
      </div>
    </div>
  );
}

export default VerticalSkeleton;
