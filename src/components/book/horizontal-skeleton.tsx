import { Skeleton } from '../ui/skeleton';

function HorizontalSkeleton() {
  return (
    <div className='flex gap-4'>
      <Skeleton className='w-[53px] h-[77px]' />
      <div className='flex flex-col mt-1'>
        <Skeleton className='w-[120px] h-[24px] mb-2' />
        <Skeleton className='w-[80px] h-[20px] mb-1' />
        <div className='flex gap-2'>
          <Skeleton className='w-[60px] h-[16px]' />
          <Skeleton className='w-[30px] h-[16px]' />
        </div>
      </div>
    </div>
  );
}

export default HorizontalSkeleton;
