import type { ReactNode } from 'react';

export default function BookLayout({ children }: { children: ReactNode }) {
  return (
    <main className='mx-auto min-h-screen max-w-md lg:max-w-6xl lg:px-8 lg:pt-20 lg:pb-12'>
      <article className='relative lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:rounded-3xl lg:bg-surface lg:p-8 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] xl:gap-12 xl:p-10'>
        {children}
      </article>
    </main>
  );
}
