import { Skeleton } from '@/components/ui/skeleton';
import { libraryGridClassName } from './library-layout';

export function LibraryBooksSkeleton() {
  return (
    <div aria-hidden='true' className={libraryGridClassName}>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className='flex flex-col gap-3'>
          <Skeleton className='aspect-[2/3] w-full rounded-sm' />
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PageFallback() {
  return (
    <>
      <div aria-hidden='true' className='flex items-center justify-between gap-4'>
        <Skeleton className='h-8 w-36' />
        <Skeleton className='h-9 w-28 rounded-full' />
      </div>
      <div aria-hidden='true' className='flex flex-wrap items-end justify-between gap-4'>
        <div className='flex flex-wrap gap-2'>
          <Skeleton className='h-9 w-20 rounded-full' />
          <Skeleton className='h-9 w-28 rounded-full' />
          <Skeleton className='h-9 w-24 rounded-full' />
        </div>
        <Skeleton className='h-11 w-full rounded-full min-[1024px]:w-72' />
      </div>
      <LibraryBooksSkeleton />
      <span role='status' className='sr-only'>Loading your library…</span>
    </>
  );
}
