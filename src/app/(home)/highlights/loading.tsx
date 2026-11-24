import { Skeleton } from "@/components/ui/skeleton"
import { highlightsColumnsClassName, highlightsPageClassName } from "./components/highlights-layout"

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
  )
}

function Loading() {
  return (
    <main className={highlightsPageClassName} aria-busy='true'>
      <header aria-hidden='true' className='flex flex-wrap items-center justify-between gap-3'>
        <Skeleton className='h-8 w-44' />
        <Skeleton className='h-9 w-36 rounded-full' />
      </header>
      <div aria-hidden='true'>
        <div className='mb-4 flex gap-2'>
          <Skeleton className='h-10 w-28 rounded-lg' />
          <Skeleton className='h-10 w-28 rounded-lg' />
        </div>
        <div className={highlightsColumnsClassName}>
          {Array.from({ length: 6 }).map((_, i) => (
            <HighlightCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <span role='status' className='sr-only'>Loading highlights…</span>
    </main>
  )
}

export default Loading
