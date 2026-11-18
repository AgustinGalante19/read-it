export const revalidate = 3600;

import { ReadingTimeline } from '@/components/ReadingTimeline';
import { getCalendarData } from '@/services/ReadingStatisticsService';
import DateSelector from './components/date-selector';
import { Book } from 'lucide-react';
import { calendarPageClassName } from './components/calendar-layout';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CalendarPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function CalendarPage(props: CalendarPageProps) {
  const searchParams = await props.searchParams;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const year = searchParams.year
    ? parseInt(searchParams.year as string)
    : currentYear;
  const month = searchParams.month
    ? parseInt(searchParams.month as string)
    : currentMonth;

  const { success, data } = await getCalendarData(month, year);

  if (!success || !data) {
    return (
      <div className={calendarPageClassName}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Book />
            </EmptyMedia>
            <EmptyTitle>Calendar not found</EmptyTitle>
            <EmptyDescription>
              We can&apos;t find a calendar for the selected month and year.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href='/search'>Search Books</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className={calendarPageClassName}>
      <header className='flex min-w-0 flex-col gap-5 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-8'>
        <div className='flex min-w-0 flex-col gap-2'>
          <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>Reading Calendar</h1>
          <p className='max-w-xl text-sm/5 text-muted-foreground'>
            Navigate between months to see your daily reading progress and track
            completed books.
          </p>
        </div>
        <DateSelector year={year} month={month} />
      </header>
      <ReadingTimeline data={data} year={year} month={month} />
    </div>
  );
}
