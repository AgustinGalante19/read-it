import HorizontalSkeleton from '@/components/book/horizontal-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <div className='container mx-auto p-4'>
      <Skeleton className='w-full h-14 my-4' />
      <div className='flex  justify-between items-center'>
        <Skeleton className='h-7 w-[163px]' />
        <Skeleton className='h-6 w-[54px]' />
      </div>
      <div className='p-2 mt-4 space-y-2'>
        <HorizontalSkeleton />
        <HorizontalSkeleton />
        <HorizontalSkeleton />
      </div>
    </div>
  );
}

export default Loading;
