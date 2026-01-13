'use client';

import { useEffect, useState } from 'react';
import { getMyStats } from '@/services/StatsService';
import Stats from '@/types/Stats';
import GeneralStats from './general-stats';
import DailyActivityChart from './daily-activity-chart';
import HourlyActivityChart from './hourly-activity-chart';
import LastBooksGraph from './last-books-graph';
import TagsRadarChart from './tags-radar-chart';
import BooksGrid from './books-grid';
import LastbooksList from './last-books-list';

export default function StatsWrapper() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Get timezone offset in minutes (negative for UTC+, positive for UTC-)
      const timezoneOffsetMinutes = -new Date().getTimezoneOffset();

      const result = await getMyStats(timezoneOffsetMinutes);
      if (result.success && result.data) {
        setStats(result.data);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return <div className='p-4'>Cargando estadísticas...</div>;
  }

  if (!stats) {
    return <div className='p-4'>No se encontraron estadísticas</div>;
  }

  return (
    <div className='space-y-4'>
      <GeneralStats
        book={stats.book}
        page={stats.page}
        tag={stats.tag}
        activity={stats.activity}
      />
      <div className='px-4 space-y-4 mt-2'>
        <DailyActivityChart data={stats.dailyActivity} />
        <HourlyActivityChart data={stats.hourlyActivity} />
        <LastBooksGraph last6MonthsReadedBooks={stats.last6MonthsReadedBooks} />
        <TagsRadarChart radarData={stats.tag.radarData} />
        <BooksGrid books={stats.book.totalBooks} />
        <LastbooksList books={stats.last6MonthsReadedBooks} />
      </div>
    </div>
  );
}
