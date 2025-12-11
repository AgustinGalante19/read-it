import { ReadingTimeline } from '@/components/ReadingTimeline';
import { getCalendarData } from '@/services/ReadingStatisticsService';
import DateSelector from './components/date-selector';
import { Calendar } from 'lucide-react';

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
      <div className='container py-10'>
        <div className='text-center text-red-500'>
          Error loading calendar data.
        </div>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='mb-2 flex flex-col gap-4 items-center justify-between'>
        <div className='flex items-center gap-2 underline decoration-primary'>
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
