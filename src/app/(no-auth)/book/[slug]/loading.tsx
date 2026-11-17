import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <>
      <div aria-hidden='true' className='lg:hidden'>
        <Skeleton className='h-[448px]' />
        <Skeleton className='h-[32px] mt-4 w-[150px]' />
        <div className='flex items-center justify-between'>
          <Skeleton className='h-[24px] mt-4 w-[100px]' />
          <div className='flex items-center gap-4'>
            <Skeleton className='h-[36px] mt-4 w-[36px] rounded-full' />
            <Skeleton className='h-[36px] mt-4 w-[36px] rounded-full' />
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
      <Skeleton aria-hidden='true' className='hidden aspect-[2/3] rounded-lg lg:block' />
      <div aria-hidden='true' className='hidden space-y-5 lg:block'>
        <Skeleton className='h-12 w-3/4' />
        <div className='flex items-center justify-between gap-4'>
          <Skeleton className='h-6 w-36' />
          <Skeleton className='h-10 w-36 rounded-full' />
        </div>
        <Skeleton className='h-5 w-56' />
        <Skeleton className='h-40 w-full rounded-xl' />
        <div className='space-y-3 border-t border-outline-variant pt-6'>
          <Skeleton className='h-7 w-40' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
        </div>
      </div>
      <span role='status' className='sr-only'>Loading book…</span>
    </>
  );
}

export default Loading;
