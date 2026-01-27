'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ChartSkeleton = () => <Skeleton className='w-full h-75 rounded-xl' />;

export const DailyActivityChart = dynamic(
  () => import('./daily-activity-chart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

export const HourlyActivityChart = dynamic(
  () => import('./hourly-activity-chart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

export const LastBooksGraph = dynamic(() => import('./last-books-graph'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export const TagsRadarChart = dynamic(() => import('./tags-radar-chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
