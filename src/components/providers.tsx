'use client';

import React from 'react';
import { Toaster } from './ui/sonner';
import { Analytics } from '@vercel/analytics/next';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      <Toaster />
      {children}
    </>
  );
}

export default Providers;
