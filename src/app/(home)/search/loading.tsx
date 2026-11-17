import { Skeleton } from '@/components/ui/skeleton';
import { searchPageClassName } from './components/search-layout';
import SearchSkeleton from './components/search-skeleton';

export default function Loading() {
  return (
    <main aria-busy='true' className={searchPageClassName}>
      <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>Search</h1>
      <Skeleton className='h-12 w-full max-w-[720px] rounded-full min-[1024px]:h-13' />
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-7 w-40' />
        <SearchSkeleton />
      </div>
    </main>
  );
}
