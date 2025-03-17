import HorizontalSkeleton from '@/components/book/horizontal-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <Skeleton className='w-[167px] h-7' />
        <Skeleton className='w-7 h-7' />
      </header>
      <div className='px-4 overflow-hidden'>
        <div className='flex overflow-x-hidden gap-2'>
          <Skeleton className='w-[250px] h-[130px]' />
          <Skeleton className='w-[250px] h-[130px]' />
        </div>
        <Skeleton className='w-[343px] h-[343px] mx-auto mt-4' />
        <div className='mt-4'>
          <div className='flex items-center justify-between'>
            <Skeleton className='w-[145px] h-[32px]' />
            <Skeleton className='w-[94px] h-[24px]' />
          </div>
          <div className='flex gap-8 mt-2'>
            <HorizontalSkeleton />
            <HorizontalSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
