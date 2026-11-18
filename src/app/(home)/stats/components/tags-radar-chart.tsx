'use client';

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TagRadarData } from '@/types/Stats';
import ChartDataTable from './chart-data-table';
import ChartEmptyState from './chart-empty-state';
import { cn } from '@/lib/utils';
import { statsChartClassName } from './stats-layout';

const chartConfig = {
  count: { label: 'Books', color: 'oklch(var(--chart-4))' },
} satisfies ChartConfig;

export default function TagsRadarChart({ radarData }: { radarData: TagRadarData[] }) {
  const maxCount = Math.max(1, ...radarData.map((item) => item.count));
  const topGenre = radarData[0];

  return (
    <Card className='flex min-w-0 flex-col'>
      <CardHeader className='p-5 pb-4'>
        <CardTitle><h3>Reading Genres</h3></CardTitle>
        <CardDescription>Distribution of your most read genres</CardDescription>
      </CardHeader>
      <CardContent className='px-5 pb-4'>
        {radarData.length ? (
          <>
            <ChartContainer config={chartConfig} className={cn(statsChartClassName, 'mx-auto max-w-96')}>
              <RadarChart accessibilityLayer data={radarData} outerRadius='64%' margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(_, payload) => payload[0]?.payload.tag} />} />
                <PolarAngleAxis dataKey='tag' tick={{ fontSize: 12, fill: 'oklch(var(--muted-foreground))' }} tickFormatter={(tag: string) => tag.length > 10 ? `${tag.slice(0, 9)}…` : tag} />
                <PolarGrid />
                <PolarRadiusAxis angle={90} domain={[0, maxCount]} tick={false} axisLine={false} tickCount={5} />
                <Radar dataKey='count' fill='var(--color-count)' fillOpacity={0.16} stroke='var(--color-count)' strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              </RadarChart>
            </ChartContainer>
            <ChartDataTable caption='Most read genres' columns={['Genre', 'Books']} rows={radarData.map((item) => [item.tag, item.count])} />
          </>
        ) : <ChartEmptyState title='No reading genres yet' description='Genres from completed books will appear here.' />}
      </CardContent>
      <CardFooter className='mt-auto px-5 pb-5'>
        <p className='text-sm/5 text-muted-foreground wrap-anywhere'>
          {topGenre ? <>Most read: <span className='font-medium text-foreground'>{topGenre.tag}</span> · {topGenre.count} book{topGenre.count !== 1 ? 's' : ''}</> : 'Based on the tags of your completed books'}
        </p>
      </CardFooter>
    </Card>
  );
}
