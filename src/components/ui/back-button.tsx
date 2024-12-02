'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      type='button'
      className='text-primary'
    >
      <ArrowLeft />
    </button>
  );
}

export default BackButton;
