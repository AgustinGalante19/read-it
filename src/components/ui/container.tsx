import React from 'react';

function Container({ children }: { children: React.ReactNode }) {
  return <div className='max-w-md mx-auto'>{children}</div>;
}

export default Container;
