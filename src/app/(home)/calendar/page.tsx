import { ReadingTimeline } from '@/components/ReadingTimeline';
import { getCalendarData } from '@/services/ReadingStatisticsService';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const getPreviousMonthLink = () => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    return `/calendar?year=${prevYear}&month=${prevMonth}`;
  };

  const getNextMonthLink = () => {
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear += 1;
    }
    return `/calendar?year=${nextYear}&month=${nextMonth}`;
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
  });

  if (!success || !data) {
    return (
      <div className='container py-10'>
        <div className='text-center text-red-500'>
          Error loading calendar data.
        </div>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='mb-8 flex items-center justify-between flex-wrap'>
        <h1 className='text-3xl font-bold'>Reading Calendar</h1>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' asChild>
            <Link href={getPreviousMonthLink()}>
              <ChevronLeft className='h-4 w-4' />
            </Link>
          </Button>
          <span className='min-w-[150px] text-center text-lg font-medium capitalize'>
            {monthName} {year}
          </span>
          <Button variant='outline' size='icon' asChild>
            <Link href={getNextMonthLink()}>
              <ChevronRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>

      <ReadingTimeline data={data} year={year} month={month} />
    </div>
  );
}
