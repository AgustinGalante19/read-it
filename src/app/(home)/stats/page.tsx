export const dynamic = 'force-dynamic';

import { ChartBar, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import StatsWrapper from './components/stats-wrapper';

async function StatsPage() {
  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <h1 className='text-xl text-white font-semibold underline decoration-primary'>
          My Reading stats
        </h1>
        <ChartBar />
      </header>

      <Link href='/wrapped' className='block mx-4 mb-6'>
        <div className='p-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg cursor-pointer transform transition hover:scale-[1.02] flex justify-between items-center relative overflow-hidden group'>
          <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity' />
          <div>
            <h2 className='text-2xl font-bold mb-1'>2025 Wrapped</h2>
            <p className='text-sm opacity-90 font-medium'>
              Your reading year in review ✨
            </p>
          </div>
          <PlayCircle className='w-10 h-10 text-white/90' />
        </div>
      </Link>

      <StatsWrapper />
    </div>
  );
}

export default StatsPage;
