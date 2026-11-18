import GeneralStats from './general-stats';
import BooksGrid from './books-grid';
import LastbooksList from './last-books-list';
import { getMyStats } from '@/services/ReadingStatisticsService';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CircleAlert, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';
import { statsChartsClassName } from './stats-layout';
import {
  DailyActivityChart,
  HourlyActivityChart,
  LastBooksGraph,
  TagsRadarChart,
} from './charts';

export default async function StatsWrapper() {
  const { data: stats } = await getMyStats();
  if (!stats) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'><CircleAlert aria-hidden='true' /></EmptyMedia>
          <EmptyTitle>Couldn’t load your statistics</EmptyTitle>
          <EmptyDescription>Try loading your reading statistics again.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button asChild variant='outline'><a href='/stats'>Try again</a></Button></EmptyContent>
      </Empty>
    );
  }

  return (
    <div className='flex min-w-0 flex-col gap-8'>
      <GeneralStats
        book={stats.book}
        page={stats.page}
        tag={stats.tag}
        activity={stats.activity}
      />
      <section aria-labelledby='reading-activity-title' className='flex min-w-0 flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1'>
          <h2 id='reading-activity-title' className='text-xl/7 font-medium'>Reading activity</h2>
          <p className='flex flex-wrap items-center gap-x-2 text-xs/5 text-muted-foreground'>
            <MonitorSmartphone aria-hidden='true' className='size-4' />
            Synced from KOReader
            <Link href='/devices' className='rounded-sm text-primary hover:underline underline-offset-4'>My devices</Link>
          </p>
        </div>
        <div className={statsChartsClassName}>
          <DailyActivityChart data={stats.dailyActivity} />
          <HourlyActivityChart data={stats.hourlyActivity} />
        </div>
      </section>
      <section aria-labelledby='reading-patterns-title' className='flex min-w-0 flex-col gap-4'>
        <h2 id='reading-patterns-title' className='text-xl/7 font-medium'>Your reading journey</h2>
        <div className={statsChartsClassName}>
          <LastBooksGraph last6MonthsReadedBooks={stats.last6MonthsReadedBooks} />
          <TagsRadarChart radarData={stats.tag.radarData} />
        </div>
      </section>
      <BooksGrid books={stats.book.totalBooks} />
      <LastbooksList books={stats.last6MonthsReadedBooks} />
    </div>
  );
}
