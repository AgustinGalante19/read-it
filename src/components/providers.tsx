'use client';

import React from 'react';
import { Toaster } from './ui/sonner';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}

export default Providers;
