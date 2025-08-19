'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const Category = ({ cat }: { cat: string }) => (
  <span className='bg-accent text-accent-foreground text-xs py-2 px-4 rounded-full'>
    {cat}
  </span>
);

function Categories({ categories }: { categories: string[] | undefined }) {
  const [showAll, setShowAll] = useState(false);

  const handleToggleShow = () => setShowAll(!showAll);

  return (
    <section>
      <div className='flex flex-wrap gap-2 mt-3 mb-2'>
        {showAll
          ? categories?.map((cat: string) => <Category key={cat} cat={cat} />)
          : categories
              ?.slice(0, 3)
              .map((cat: string) => <Category key={cat} cat={cat} />)}
      </div>
      {categories?.length && categories?.length > 3 && (
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
