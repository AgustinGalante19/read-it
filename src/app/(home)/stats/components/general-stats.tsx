import type { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Stats from '@/types/Stats';
import { Book, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';
import { EreaderWarning } from './ereader-warning';
import { statsSummaryClassName } from './stats-layout';

function StatCard({ title, icon, value, unit, children }: {
  title: string;
  icon: ReactNode;
  value: number;
  unit?: string;
  children: ReactNode;
}) {
  return (
    <Card className='flex min-w-0 flex-col'>
      <CardHeader className='p-5 pb-3'>
        <div className='flex min-h-6 items-center justify-between gap-3'>
          <CardTitle><h2 className='text-sm/5 font-medium'>{title}</h2></CardTitle>
          <div className='shrink-0 text-muted-foreground'>{icon}</div>
        </div>
      </CardHeader>
      <CardContent className='px-5 pb-3'>
        <p className='flex flex-wrap items-baseline gap-x-2 text-primary'>
          <span className='text-3xl/9 font-medium tabular-nums'>{value.toLocaleString()}</span>
          {unit && <span className='text-sm text-muted-foreground'>{unit}</span>}
        </p>
      </CardContent>
      <CardFooter className='mt-auto items-start px-5 pb-5'>
        <p className='text-xs/5 text-muted-foreground wrap-anywhere'>{children}</p>
      </CardFooter>
    </Card>
  );
}

export default function GeneralStats({ book, page, tag, activity }:
  Omit<Stats, 'last6MonthsReadedBooks' | 'dailyActivity' | 'hourlyActivity'>,
) {
  return (
    <section aria-label='Reading overview' className={statsSummaryClassName}>
      <StatCard title='Books read' value={book.count} icon={<Book aria-hidden='true' className='size-4' />}>
        {book.lastRead.googleId ? (
          <>Last read: <Link href={`/book/${book.lastRead.googleId}`} className='text-primary underline-offset-4 hover:underline'>{book.lastRead.title}</Link></>
        ) : 'No completed books in the last 6 months'}
      </StatCard>
      <StatCard title='Page count' value={page.totalPageCount} icon={<BookOpen aria-hidden='true' className='size-4' />}>
        {page.lastMonthCount.toLocaleString()} pages last month
      </StatCard>
      <StatCard title='Tags count' value={tag.tagCount} icon={<Tag aria-hidden='true' className='size-4' />}>
        {tag.lastTagReaded ? `Last genre read: ${tag.lastTagReaded}` : 'No reading genres yet'}
      </StatCard>
      <StatCard title='7 Day Activity' value={activity.week.pages} unit='pages' icon={<EreaderWarning />}>
        {Math.round(activity.week.duration / 60).toLocaleString()} mins read this week
      </StatCard>
      <StatCard title='30 Day Activity' value={activity.month.pages} unit='pages' icon={<EreaderWarning />}>
        {Math.floor(activity.month.duration / 3600)}h {Math.round((activity.month.duration % 3600) / 60)}m read this month
      </StatCard>
    </section>
  );
}
