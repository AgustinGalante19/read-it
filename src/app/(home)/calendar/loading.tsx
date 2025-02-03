import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <Skeleton className='w-9 h-9' />
        <Skeleton className='h-9 w-[200px]' />
        <Skeleton className='w-9 h-9' />
      </div>
      <Skeleton className='h-[600px] w-full' />
    </div>
  );
}
