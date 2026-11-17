'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

function BackButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      type='button'
      aria-label='Go back'
      className={cn('inline-flex shrink-0 items-center gap-2 text-primary', className)}
    >
      <ArrowLeft aria-hidden='true' />
      {children}
    </button>
  );
}

export default BackButton;
