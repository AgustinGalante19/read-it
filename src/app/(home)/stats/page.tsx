import StatsWrapper from './components/stats-wrapper';
import { statsPageClassName } from './components/stats-layout';

async function StatsPage() {
  return (
    <div className={statsPageClassName}>
      <header>
        <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>
          My Reading Stats
        </h1>
      </header>
      <StatsWrapper />
    </div>
  );
}

export default StatsPage;
