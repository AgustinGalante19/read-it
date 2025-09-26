'use client';

import { Button } from '@/components/ui/button';
import React, { useMemo, useState } from 'react';

const Category = ({ cat }: { cat: string }) => (
  <span className='bg-accent text-accent-foreground text-xs py-2 px-4 rounded-full'>
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
    <section>
      <div className='flex flex-wrap gap-2 mt-3 mb-2'>
        {categoriesToShow.map((cat: string, i) => (
          <Category key={`${cat}-${i}`} cat={cat} />
        ))}
      </div>
      {categories.length > 3 && (
        <div>
          <Button variant='link' onClick={handleToggleShow}>
            {!showAll ? 'Show more' : 'Show less'}
          </Button>
        </div>
      )}
    </section>
  );
}

export default Categories;
