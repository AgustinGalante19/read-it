export const dynamic = 'force-dynamic';

import GeneralStats from './components/general-stats';
import { ChartBar, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import LastBooksGraph from './components/last-books-graph';
import LastbooksList from './components/last-books-list';
import TagsRadarChart from './components/tags-radar-chart';
import { getMyStats } from '@/services/StatsService';
import BooksGrid from './components/books-grid';

import DailyActivityChart from './components/daily-activity-chart';
import HourlyActivityChart from './components/hourly-activity-chart';

async function StatsPage() {
  const { data } = await getMyStats();
  if (!data) {
    return <div>No stats found</div>;
  }

  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <h1 className='text-xl text-white font-semibold underline decoration-primary'>
          My Reading stats
        </h1>
        <ChartBar />
      </header>

      <Link href="/wrapped" className="block mx-4 mb-6">
        <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg cursor-pointer transform transition hover:scale-[1.02] flex justify-between items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div>
            <h2 className="text-2xl font-bold mb-1">2025 Wrapped</h2>
            <p className="text-sm opacity-90 font-medium">Your reading year in review ✨</p>
          </div>
          <PlayCircle className="w-10 h-10 text-white/90" />
        </div>
      </Link>
      <GeneralStats
        book={data.book}
        page={data.page}
        tag={data.tag}
        activity={data.activity}
      />
      <div className='px-4 space-y-4 mt-2'>
        <DailyActivityChart data={data.dailyActivity} />
        <HourlyActivityChart data={data.hourlyActivity} />
        <LastBooksGraph last6MonthsReadedBooks={data.last6MonthsReadedBooks} />
        <TagsRadarChart radarData={data.tag.radarData} />
        <BooksGrid books={data.book.totalBooks} />
        <LastbooksList books={data.last6MonthsReadedBooks} />
      </div>
    </div>
  );
}

export default StatsPage;
