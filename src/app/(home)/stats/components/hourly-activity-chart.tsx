'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
  pages: {
    label: 'Pages Read',
    color: 'oklch(var(--chart-3))',
  },
} satisfies ChartConfig;

function HourlyActivityChart({
  data,
}: {
  data: { hour: number; pages: number; duration: number }[];
}) {
  const formattedData = data.map((item) => ({
    ...item,
    time: `${item.hour.toString().padStart(2, '0')}:00`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Reading Habits</CardTitle>
        <CardDescription>
          When do you read the most? (Pages per hour)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
          <AreaChart accessibilityLayer data={formattedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='time'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={3}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey='pages'
              type='natural'
              fill='var(--color-pages)'
              fillOpacity={0.4}
              stroke='var(--color-pages)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default HourlyActivityChart;
