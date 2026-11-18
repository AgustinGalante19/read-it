'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '@/types/Book';
import ChartDataTable from './chart-data-table';
import ChartEmptyState from './chart-empty-state';
import { statsChartClassName } from './stats-layout';

const chartConfig = {
  count: { label: 'Books', color: 'oklch(var(--chart-4))' },
} satisfies ChartConfig;

type ChartData = { [month: string]: { month: string; count: number } };

export default function LastBooksGraph({ last6MonthsReadedBooks }: { last6MonthsReadedBooks: Book[] }) {
  const chartData = last6MonthsReadedBooks.reduce((acc: ChartData, book) => {
    const finishDate = new Date(book.finish_date as string);
    const monthName = finishDate.toLocaleString('en-US', { month: 'long' });
    if (!acc[monthName]) acc[monthName] = { month: monthName, count: 0 };
    acc[monthName].count += 1;
    return acc;
  }, {} as ChartData);
  const chartDataArray = Object.values(chartData).reverse();
  const totalBooksReaded = chartDataArray.reduce((acc, { count }) => acc + count, 0);

  return (
    <Card className='flex min-w-0 flex-col'>
      <CardHeader className='p-5 pb-4'>
        <CardTitle><h3>Books read in the last 6 months</h3></CardTitle>
        <CardDescription>Completed books, month by month</CardDescription>
      </CardHeader>
      <CardContent className='px-5 pb-4'>
        {chartDataArray.length ? (
          <>
            <ChartContainer config={chartConfig} className={statsChartClassName}>
              <BarChart accessibilityLayer data={chartDataArray} layout='vertical' margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type='number' dataKey='count' tickLine={false} axisLine={false} allowDecimals={false} tickCount={4} />
                <YAxis dataKey='month' type='category' tickLine={false} tickMargin={8} axisLine={false} width={36} tickFormatter={(value) => value.slice(0, 3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey='count' fill='var(--color-count)' radius={[0, 4, 4, 0]} maxBarSize={28} isAnimationActive={false} />
              </BarChart>
            </ChartContainer>
            <ChartDataTable caption='Books completed in the last 6 months' columns={['Month', 'Books']} rows={chartDataArray.map((item) => [item.month, item.count])} />
          </>
        ) : <ChartEmptyState title='No completed books in this period' description='Books you finish will appear in your reading history.' />}
      </CardContent>
      <CardFooter className='mt-auto flex-wrap gap-x-5 gap-y-1 px-5 pb-5'>
        <p className='text-sm/5 text-muted-foreground'><span className='font-medium text-foreground tabular-nums'>{(totalBooksReaded / 6).toFixed(2)}</span> books per month</p>
        <p className='text-sm/5 text-muted-foreground'><span className='font-medium text-foreground tabular-nums'>{totalBooksReaded}</span> books in total</p>
      </CardFooter>
    </Card>
  );
}
