import { Skeleton } from '@/components/ui/skeleton';
import { searchBookListClassName } from './search-layout';

export default function SearchSkeleton() {
  return (
    <div aria-hidden='true' className={searchBookListClassName}>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className='flex items-center gap-4 min-[1024px]:flex-col min-[1024px]:items-stretch min-[1024px]:gap-3'>
          <Skeleton className='aspect-[2/3] w-14 shrink-0 rounded-sm min-[1024px]:w-full' />
          <div className='flex min-w-0 flex-1 flex-col gap-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  );
}
