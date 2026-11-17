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
      className='max-[600px]:h-12'
      isLoading={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      Try again
    </Button>
  );
}
