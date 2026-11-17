import { Skeleton } from '@/components/ui/skeleton';
import {
  bookGridClassName,
  homePageClassName,
  readingGridClassName,
} from './_components/home-layout';

export default function Loading() {
  return (
    <main className={homePageClassName} aria-busy='true'>
      <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>Home</h1>
      <p role='status' className='sr-only'>Loading your books…</p>
      <div aria-hidden='true' className='space-y-8'>
        <div className='space-y-2'>
          <div className='flex h-12 items-center justify-between min-[600px]:h-9'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-5 w-16' />
          </div>
          <div className={readingGridClassName}>
            <div className='grid grid-cols-[4.5rem_minmax(0,1fr)] grid-rows-[1fr_auto] gap-x-4 gap-y-3 min-[600px]:grid-cols-[6rem_minmax(0,1fr)] min-[1024px]:grid-cols-[7.5rem_minmax(0,1fr)]'>
              <Skeleton className='row-span-2 aspect-[2/3] self-start rounded-sm' />
              <div className='min-w-0 space-y-3'>
                <Skeleton className='h-6 w-3/4 max-w-64' />
                <Skeleton className='h-5 w-1/2 max-w-40' />
                <Skeleton className='h-2 w-full max-w-xl rounded-full' />
                <Skeleton className='h-5 w-2/3 max-w-48' />
              </div>
              <Skeleton className='col-start-2 h-12 w-36 max-w-full rounded-full min-[600px]:h-9' />
            </div>
          </div>
        </div>
        {['readlist', 'read'].map((section) => (
          <div key={section} className='space-y-2'>
            <div className='flex h-12 items-center justify-between min-[600px]:h-9'>
              <Skeleton className='h-6 w-28' />
              <Skeleton className='h-5 w-16' />
            </div>
            <div className={bookGridClassName}>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className='space-y-3'>
                  <Skeleton className='aspect-[2/3] rounded-sm' />
                  <div className='space-y-1'>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
