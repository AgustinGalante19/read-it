'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from './ui/sonner';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster />
      {children}
    </SessionProvider>
  );
}

export default Providers;
