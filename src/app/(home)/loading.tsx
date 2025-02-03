import HorizontalSkeleton from '@/components/book/horizontal-skeleton';
import VerticalSkeleton from '@/components/book/vertical-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <div className='p-4'>
      <header className='flex justify-between items-center'>
        <Skeleton className='w-[200px] h-8' />
        <Skeleton className='w-[20px] h-[27px]' />
      </header>
      <div className='my-6'>
        <div className='flex my-2 justify-between items-center'>
          <Skeleton className='w-[136px] h-8' />
          <Skeleton className='w-[94px] h-6' />
        </div>
        <div className='flex justify-between gap-2'>
          <VerticalSkeleton />
          <VerticalSkeleton />
          <VerticalSkeleton />
        </div>
        <div className='flex mt-4 mb-2 justify-between items-center'>
          <Skeleton className='w-[136px] h-8' />
          <Skeleton className='w-[94px] h-6' />
        </div>
        <div className='flex justify-between gap-2 overflow-x-hidden'>
          <HorizontalSkeleton />
          <HorizontalSkeleton />
          <HorizontalSkeleton />
        </div>
        <div className='flex mt-4 justify-between items-center mb-2'>
          <Skeleton className='w-[136px] h-8' />
          <Skeleton className='w-[94px] h-6' />
        </div>
        <div className='flex justify-between gap-2'>
          <VerticalSkeleton />
          <VerticalSkeleton />
          <VerticalSkeleton />
        </div>
      </div>
    </div>
  );
}

export default Loading;
