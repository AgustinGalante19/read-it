'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Category = ({ cat, index, collapsed }: { cat: string; index: number; collapsed: boolean }) => (
  <span
    className={cn(
      'rounded-full bg-accent px-4 py-2 text-xs text-accent-foreground',
      'animate-in fade-in-0 slide-in-from-bottom-2 zoom-in-95 transition-all duration-300 hover:scale-105 hover:shadow-md',
      'lg:animate-none lg:bg-surface-container lg:text-muted-foreground lg:wrap-anywhere lg:hover:scale-100 lg:hover:shadow-none',
      collapsed && 'hidden lg:inline-flex',
    )}
    style={{
      animationDelay: `${index * 100}ms`,
      animationFillMode: 'both',
    }}
  >
    {cat}
  </span>
);

function Categories({ categories = [] }: { categories: string[] | undefined }) {
  const [showAll, setShowAll] = useState(false);

  if (categories.length === 0) return null;

  return (
    <section className='animate-in fade-in-0 slide-in-from-bottom-4 duration-500 lg:order-2 lg:animate-none'>
      <div className='mt-3 mb-2 flex flex-wrap gap-2 lg:m-0'>
        {categories.map((cat, index) => (
          <Category key={`${cat}-${index}`} cat={cat} index={index} collapsed={!showAll && index >= 3} />
        ))}
      </div>
      {categories.length > 3 && (
        <div
          className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300 lg:hidden'
          style={{
            animationDelay: `${(showAll ? categories.length : 3) * 100 + 50}ms`,
            animationFillMode: 'both',
          }}
        >
          <Button
            variant='link'
            onClick={() => setShowAll((expanded) => !expanded)}
            className='px-0 transition-all duration-75 hover:scale-105'
            aria-expanded={showAll}
          >
            {!showAll ? 'Show more' : 'Show less'}
          </Button>
        </div>
      )}
    </section>
  );
}

export default Categories;
