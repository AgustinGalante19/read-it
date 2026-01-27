export const revalidate = 3600;

import { ReadingTimeline } from '@/components/ReadingTimeline';
import { getCalendarData } from '@/services/ReadingStatisticsService';
import DateSelector from './components/date-selector';
import { Book, Calendar } from 'lucide-react';

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
    );
  }

  return (
    <div className='container py-10'>
      <div className='mb-2 flex flex-col gap-4 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h1 className='text-3xl font-bold'>Reading Calendar</h1>
          <Calendar />
        </div>
        <p className='px-2 text-sm text-muted-foreground max-w-2xl'>
          Navigate between months to see your daily reading progress, track
          completed books, and explore your reading patterns.
        </p>
        <DateSelector year={year} month={month} />
      </div>
      <ReadingTimeline data={data} year={year} month={month} />
    </div>
  );
}
