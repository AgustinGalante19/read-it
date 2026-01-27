import { ChartBar } from 'lucide-react';
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
      <StatsWrapper />
    </div>
  );
}

export default StatsPage;
