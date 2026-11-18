'use client';

import dynamic from 'next/dynamic';
import StatsChartSkeleton from './chart-skeleton';

export const DailyActivityChart = dynamic(
  () => import('./daily-activity-chart'),
  {
    ssr: false,
    loading: () => <StatsChartSkeleton />,
  },
);

export const HourlyActivityChart = dynamic(
  () => import('./hourly-activity-chart'),
  {
    ssr: false,
    loading: () => <StatsChartSkeleton />,
  },
);

export const LastBooksGraph = dynamic(() => import('./last-books-graph'), {
  ssr: false,
  loading: () => <StatsChartSkeleton />,
});

export const TagsRadarChart = dynamic(() => import('./tags-radar-chart'), {
  ssr: false,
  loading: () => <StatsChartSkeleton />,
});
