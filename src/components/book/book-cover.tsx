'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function BookCover({ src, sizes }: { src?: string; sizes: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const cover = src?.trim();
  const hasCover =
    cover &&
    cover !== failedSrc &&
    cover !== '/thumbnail-fallback.jpg' &&
    cover !== '/small-thumbnail-fallback.jpg';

  return (
    <div className='relative aspect-[2/3]'>
      {hasCover ? (
        <Image
          src={cover}
          alt=''
          fill
          sizes={sizes}
          className='rounded-sm object-contain object-bottom drop-shadow-sm'
          onError={() => setFailedSrc(cover)}
        />
      ) : (
        <div className='absolute inset-0 grid place-items-center rounded-sm bg-surface-container-high'>
          <BookOpen aria-hidden='true' className='size-6 text-muted-foreground' />
        </div>
      )}
    </div>
  );
}
