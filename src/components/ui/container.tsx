import React from 'react';

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1 relative'>
        <div className='max-w-md mx-auto'>{children}</div>
      </div>
    </div>
  );
}

export default Container;
