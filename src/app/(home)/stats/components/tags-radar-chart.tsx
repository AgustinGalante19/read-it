'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TagRadarData } from '@/types/Stats';

const chartConfig = {
  count: {
    label: 'Books',
    color: 'oklch(var(--chart-1))',
  },
} satisfies ChartConfig;

const truncateLabel = (text: string, maxLength: number = 10): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

function TagsRadarChart({ radarData }: { radarData: TagRadarData[] }) {
  if (!radarData || radarData.length === 0) {
    return (
      <section className='p-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-secondary-foreground'>
              Tags Distribution
            </CardTitle>
            <CardDescription>No data available</CardDescription>
          </CardHeader>
          <CardContent className='flex h-48 items-center justify-center'>
            <p className='text-muted-foreground'>No tags found</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const maxCount = Math.max(...radarData.map((item) => item.count));
  const processedData = radarData.map((item) => ({
    ...item,
    tag: truncateLabel(item.tag, 9),
    originalTag: item.tag,
  }));

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: unknown[];
  }) => {
    if (active && payload && payload.length) {
      const data = (
        payload[0] as { payload: TagRadarData & { originalTag: string } }
      ).payload;
      return (
        <div className='rounded border bg-background p-2 shadow-md'>
          <p className='font-medium'>{data.originalTag}</p>
          <p className='text-sm text-muted-foreground'>
            {data.count} book{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className='text-secondary-foreground'>
            Reading Genres
          </CardTitle>
          <CardDescription>
            Distribution of your most read genres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[350px]'
          >
            <RadarChart
              data={processedData}
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            >
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <PolarAngleAxis dataKey='tag' tick={{ fontSize: 12 }} />
              <PolarGrid />
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxCount]}
                tick={false}
                tickCount={5}
              />
              <Radar
                dataKey='count'
                fill='var(--color-count)'
                fillOpacity={0.3}
                stroke='var(--color-count)'
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
          <CardFooter className='p-0 text-sm'>
            <span className='text-muted-foreground'>
              Your most read genre is{' '}
              <span className='text-primary font-semibold'>
                {processedData[0]?.originalTag || 'Unknown'}
              </span>{' '}
              with{' '}
              <span className='text-primary font-semibold'>
                {processedData[0]?.count || 0}{' '}
              </span>{' '}
              book{processedData[0]?.count !== 1 ? 's' : ''} read.
            </span>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  );
}

export default TagsRadarChart;
