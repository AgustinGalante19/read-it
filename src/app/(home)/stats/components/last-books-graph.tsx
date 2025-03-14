'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Book } from '@/types/Book';

const chartConfig = {
  count: {
    label: 'count',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type ChartData = {
  [month: string]: { month: string; count: number };
};

function LastBooksGraph({
  last6MonthsReadedBooks,
}: {
  last6MonthsReadedBooks: Book[];
}) {
  const chartData = last6MonthsReadedBooks.reduce((acc: ChartData, book) => {
    const readedAt = new Date(book.readed_at as Date);
    const monthName = readedAt.toLocaleString('en-US', { month: 'long' });

    if (!acc[monthName]) {
      acc[monthName] = { month: monthName, count: 0 };
    }

    acc[monthName].count += 1;

    return acc;
  }, {} as ChartData);

  const chartDataArray = Object.values(chartData);

  const totalBooksReaded = chartDataArray.reduce(
    (acc, { count }) => acc + count,
    0
  );

  return (
    <section className='p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Books Readed</CardTitle>
          <CardDescription>Past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartDataArray}
              layout='vertical'
              margin={{
                left: -20,
              }}
            >
              <XAxis type='number' dataKey='count' hide />
              <YAxis
                dataKey='month'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='count' fill='var(--color-count)' radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            {(totalBooksReaded / 6).toFixed(2)} books readed per month{' '}
            <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Total books readed {totalBooksReaded}
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}

export default LastBooksGraph;
