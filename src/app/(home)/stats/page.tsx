'use server';

import GeneralStats from './components/general-stats';
import { ChartBar } from 'lucide-react';
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
