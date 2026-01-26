import { Skeleton } from '@/components/ui/skeleton';

function HighlightCardSkeleton() {
  return (
    <div className='rounded-xl bg-surface-container border border-border/50 p-4'>
      {/* Book info header */}
      <div className='flex items-start gap-3 mb-4'>
        <Skeleton className='w-12 h-16 rounded-md' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/2' />
        </div>
      </div>

      {/* Highlight text */}
      <div className='pl-4 border-l-2 border-muted mb-4 space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>

      {/* Footer */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-5 w-16 rounded-full' />
        <Skeleton className='h-4 w-24' />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <Skeleton className='w-35 h-7' />
        <Skeleton className='w-5 h-5' />
      </header>
      <div className='px-4 pb-4'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <HighlightCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;
