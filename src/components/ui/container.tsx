import React from 'react';

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-full'>
      <div className='max-w-md mx-auto'>{children}</div>
    </div>
  );
}

export default Container;
