import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <div>
      <Skeleton className='h-[448px]' />
      <Skeleton className='h-[32px]  mt-4 w-[150px]' />
      <div className='flex items-center justify-between'>
        <Skeleton className='h-[24px]  mt-4 w-[100px]' />
        <div className='flex items-center gap-4'>
          <Skeleton className='h-[36px]  mt-4 w-[36px] rounded-full' />
          <Skeleton className='h-[36px]  mt-4 w-[36px] rounded-full' />
        </div>
      </div>
      <div className='flex gap-4'>
        <Skeleton className='h-[40px] mt-4 w-[150px]' />
        <Skeleton className='h-[40px] mt-4 w-[150px]' />
      </div>
      <Skeleton className='h-[40px] mt-4' />
      <Skeleton className='h-[28px] mt-4' />
      <Skeleton className='h-[160px] mt-4' />
    </div>
  );
}

export default Loading;
