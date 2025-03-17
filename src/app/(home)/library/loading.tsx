import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <div className='overflow-hidden'>
      <header className='w-full flex p-4 justify-between items-center container mx-auto'>
        <span className='text-2xl font-bold text-white flex items-center gap-2 underline decoration-primary'>
          <Skeleton className='w-[124px] h-[32px]' />
        </span>
        <Skeleton className='w-[24px] h-[24px]' />
      </header>
      <div className='flex items-center gap-4 px-4'>
        <Skeleton className='w-[130px] h-[36px] rounded-full' />
        <Skeleton className='w-[110px] h-[36px] rounded-full' />
        <Skeleton className='w-[120px] h-[36px] rounded-full' />
      </div>
      <section className='px-4 mt-2'>
        <Skeleton className='w-[29px] h-[18px] mb-2' />
        <Skeleton className='w-[416px] h-[38px]' />
      </section>
      <section>
        <div className='128x172 grid grid-cols-2 gap-2 py-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-[272px] w-[128px] space-y-1 mx-auto'>
              <Skeleton className='w-full h-[190px]' />
              <Skeleton className='w-[128px] h-[22px]' />
              <Skeleton className='w-[128px] h-[22px]' />
              <div className='flex items-center gap-2'>
                <Skeleton className='w-[128px] h-[16px]' />
                <Skeleton className='w-[50px] h-[16px]' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Loading;
