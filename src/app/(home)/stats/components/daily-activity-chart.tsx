'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ChartDataTable from './chart-data-table';
import ChartEmptyState from './chart-empty-state';
import { statsChartClassName } from './stats-layout';

const chartConfig = {
  minutes: { label: 'Minutes', color: 'oklch(var(--chart-4))' },
} satisfies ChartConfig;

export default function DailyActivityChart({ data }: {
  data: { date: string; pages: number; duration: number }[];
}) {
  const formattedData = data.map((item) => ({
    ...item,
    minutes: Math.round(item.duration / 60),
    day: new Date(item.date).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', timeZone: 'UTC',
    }),
  }));
  const totalMinutes = Math.round(data.reduce((sum, item) => sum + item.duration, 0) / 60);

  return (
    <Card className='flex min-w-0 flex-col'>
      <CardHeader className='p-5 pb-4'>
        <CardTitle><h3>Last 30 Days Activity</h3></CardTitle>
        <CardDescription>Daily reading duration in minutes</CardDescription>
      </CardHeader>
      <CardContent className='px-5 pb-4'>
        {data.length ? (
          <>
            <ChartContainer config={chartConfig} className={statsChartClassName}>
              <BarChart accessibilityLayer data={formattedData} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='day' tickLine={false} tickMargin={10} axisLine={false} minTickGap={24} />
                <YAxis tickLine={false} axisLine={false} width={32} tickCount={4} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='minutes' fill='var(--color-minutes)' radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
              </BarChart>
            </ChartContainer>
            <ChartDataTable caption='Daily reading activity in the last 30 days' columns={['Date', 'Minutes', 'Pages']} rows={formattedData.map((item) => [item.date, item.minutes, item.pages])} />
          </>
        ) : <ChartEmptyState title='No recent activity' description='Your synced reading sessions from the last 30 days will appear here.' />}
      </CardContent>
      <CardFooter className='mt-auto px-5 pb-5'>
        <p className='text-sm/5 text-muted-foreground'><span className='font-medium text-foreground tabular-nums'>{totalMinutes.toLocaleString()} min</span> recorded in the last 30 days</p>
      </CardFooter>
    </Card>
  );
}
