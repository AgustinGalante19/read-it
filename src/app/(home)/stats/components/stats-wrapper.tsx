import GeneralStats from './general-stats';
import DailyActivityChart from './daily-activity-chart';
import HourlyActivityChart from './hourly-activity-chart';
import LastBooksGraph from './last-books-graph';
import TagsRadarChart from './tags-radar-chart';
import BooksGrid from './books-grid';
import LastbooksList from './last-books-list';
import { getMyStats } from '@/services/ReadingStatisticsService';

export default async function StatsWrapper() {
  const { data: stats } = await getMyStats();
  if (!stats) return <div>No statistics available.</div>;

  return (
    <div className='space-y-4'>
      <GeneralStats
        book={stats.book}
        page={stats.page}
        tag={stats.tag}
        activity={stats.activity}
      />
      <div className='px-4 space-y-4 mt-2'>
        <DailyActivityChart data={stats.dailyActivity} />
        <HourlyActivityChart data={stats.hourlyActivity} />
        <LastBooksGraph last6MonthsReadedBooks={stats.last6MonthsReadedBooks} />
        <TagsRadarChart radarData={stats.tag.radarData} />
        <BooksGrid books={stats.book.totalBooks} />
        <LastbooksList books={stats.last6MonthsReadedBooks} />
      </div>
    </div>
  );
}
