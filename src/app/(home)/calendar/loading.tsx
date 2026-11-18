import { Skeleton } from '@/components/ui/skeleton';
import { calendarPageClassName } from './components/calendar-layout';

export default function Loading() {
  return (
    <div className={calendarPageClassName}>
      <div aria-hidden='true' className='flex flex-col gap-5 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-9 w-60 max-w-full' />
          <Skeleton className='h-10 w-96 max-w-full min-[1024px]:h-5' />
        </div>
        <div className='flex items-center justify-between gap-1 min-[600px]:justify-start'>
          <Skeleton className='size-9 rounded-full' />
          <Skeleton className='h-9 w-40 rounded-full' />
          <Skeleton className='size-9 rounded-full' />
        </div>
      </div>
      <div aria-hidden='true' className='overflow-hidden rounded-xl border'>
        <Skeleton className='h-8 w-full rounded-none min-[600px]:h-11' />
        <div className='grid grid-cols-7 gap-px bg-border'>
          {Array.from({ length: 35 }, (_, index) => (
            <Skeleton key={index} className='h-[90px] rounded-none min-[600px]:h-30 min-[1024px]:h-46 min-[1440px]:h-48' />
          ))}
        </div>
      </div>
      <span role='status' className='sr-only'>Loading your reading calendar…</span>
    </div>
  );
}
