import { Skeleton } from '@/components/ui/skeleton';
import StatsChartSkeleton from './components/chart-skeleton';
import { statsChartsClassName, statsPageClassName, statsSummaryClassName } from './components/stats-layout';

export default function Loading() {
  return (
    <div className={statsPageClassName}>
      <div aria-hidden='true' className='flex flex-col gap-8'>
        <Skeleton className='h-9 w-56 max-w-full' />
        <div className={statsSummaryClassName}>
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className='h-40 rounded-xl' />)}
        </div>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className='flex flex-col gap-4'>
            <Skeleton className='h-7 w-44' />
            <div className={statsChartsClassName}><StatsChartSkeleton /><StatsChartSkeleton /></div>
          </div>
        ))}
        <Skeleton className='h-48 w-full rounded-xl' />
        <Skeleton className='h-7 w-40' />
        <div className='grid gap-5 min-[600px]:grid-cols-2 min-[1280px]:grid-cols-3'>
          {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className='h-20 w-full' />)}
        </div>
      </div>
      <span role='status' className='sr-only'>Loading your reading statistics…</span>
    </div>
  );
}
