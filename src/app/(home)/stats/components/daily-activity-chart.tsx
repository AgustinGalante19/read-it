'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const chartConfig = {
  duration: {
    label: 'Minutes',
    color: 'oklch(var(--chart-4))',
  },
  pages: {
    label: 'Pages',
    color: 'oklch(var(--chart-1))',
  },
} satisfies ChartConfig;

function DailyActivityChart({
  data,
}: {
  data: { date: string; pages: number; duration: number }[];
}) {
  const formattedData = data.map((item) => ({
    ...item,
    minutes: Math.round(item.duration / 60),
    day: new Date(item.date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 30 Days Activity</CardTitle>
        <CardDescription>Daily reading duration in minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-50 w-full'>
          <BarChart accessibilityLayer data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='day'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='minutes' fill='var(--color-duration)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default DailyActivityChart;
