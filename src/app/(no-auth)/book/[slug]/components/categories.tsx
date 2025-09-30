'use client';

import { Button } from '@/components/ui/button';
import React, { useMemo, useState } from 'react';

const Category = ({ cat, index }: { cat: string; index: number }) => (
  <span
    className='bg-accent text-accent-foreground text-xs py-2 px-4 rounded-full
               animate-in fade-in-0 slide-in-from-bottom-2 zoom-in-95
               transition-all duration-300 hover:scale-105 hover:shadow-md'
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

  const handleToggleShow = () => setShowAll(!showAll);

  const categoriesToShow = useMemo(
    () => (showAll ? categories : categories.slice(0, 3)),
    [showAll, categories]
  );

  if (categories.length === 0) return null;

  return (
    <section className='animate-in fade-in-0 slide-in-from-bottom-4 duration-500'>
      <div className='flex flex-wrap gap-2 mt-3 mb-2'>
        {categoriesToShow.map((cat: string, i) => (
          <Category key={`${cat}-${i}`} cat={cat} index={i} />
        ))}
      </div>
      {categories.length > 3 && (
        <div
          className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
          style={{
            animationDelay: `${categoriesToShow.length * 100 + 50}ms`,
            animationFillMode: 'both',
          }}
        >
          <Button
            variant='link'
            onClick={handleToggleShow}
            className='transition-all duration-75 hover:scale-105'
          >
            {!showAll ? 'Show more' : 'Show less'}
          </Button>
        </div>
      )}
    </section>
  );
}

export default Categories;
