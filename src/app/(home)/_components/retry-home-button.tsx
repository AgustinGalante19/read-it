'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RetryHomeButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type='button'
      variant='outline'
      className='h-12 min-[600px]:h-10'
      isLoading={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      Try again
    </Button>
  );
}
