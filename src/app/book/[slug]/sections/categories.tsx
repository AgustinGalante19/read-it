'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

function Categories({ categories }: { categories: string[] | undefined }) {
  const [showAll, setShowAll] = useState(false);

  const handleToggleShow = () => setShowAll(!showAll);

  return (
    <section>
      <div className='flex flex-wrap gap-2 mt-3 mb-2'>
        {showAll
          ? categories?.map((cat: string) => (
              <span
                key={cat}
                className='bg-[#313333] text-white py-2 px-4 rounded-lg'
              >
                {cat}
              </span>
            ))
          : categories?.slice(0, 3).map((cat: string) => (
              <span
                key={cat}
                className='bg-[#313333] text-white py-2 px-4 rounded-lg'
              >
                {cat}
              </span>
            ))}
      </div>
      {categories?.length && categories?.length > 3 && (
        <div className='flex justify-end mb-2'>
          <Button variant='link' onClick={handleToggleShow}>
            {!showAll ? 'Show more' : 'Show less'}
          </Button>
        </div>
      )}
    </section>
  );
}

export default Categories;
