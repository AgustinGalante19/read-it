'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ChartDataTable from './chart-data-table';
import ChartEmptyState from './chart-empty-state';
import { statsChartClassName } from './stats-layout';

const chartConfig = {
  pages: { label: 'Pages Read', color: 'oklch(var(--chart-4))' },
} satisfies ChartConfig;

export default function HourlyActivityChart({ data }: {
  data: { hour: number; pages: number; duration: number }[];
}) {
  const formattedData = data.map((item) => ({
    ...item, time: `${item.hour.toString().padStart(2, '0')}:00`,
  }));
  const totalPages = data.reduce((sum, item) => sum + item.pages, 0);

  return (
    <Card className='flex min-w-0 flex-col'>
      <CardHeader className='p-5 pb-4'>
        <CardTitle><h3>Hourly Reading Habits</h3></CardTitle>
        <CardDescription>Pages read by hour of day · All time</CardDescription>
      </CardHeader>
      <CardContent className='px-5 pb-4'>
        {totalPages ? (
          <>
            <ChartContainer config={chartConfig} className={statsChartClassName}>
              <AreaChart accessibilityLayer data={formattedData} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='time' tickLine={false} tickMargin={10} axisLine={false} interval={5} />
                <YAxis tickLine={false} axisLine={false} width={32} tickCount={4} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey='pages' type='monotone' fill='var(--color-pages)' fillOpacity={0.16} stroke='var(--color-pages)' strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ChartContainer>
            <ChartDataTable caption='All-time reading activity by hour of day' columns={['Hour (UTC)', 'Pages']} rows={formattedData.map((item) => [item.time, item.pages])} />
          </>
        ) : <ChartEmptyState title='No hourly activity yet' description='Sync your e-reader to see when you spend time reading.' />}
      </CardContent>
      <CardFooter className='mt-auto px-5 pb-5'>
        <p className='text-sm/5 text-muted-foreground'>Reading sessions grouped by hour (UTC)</p>
      </CardFooter>
    </Card>
  );
}
