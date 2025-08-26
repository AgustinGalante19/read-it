'use server';

import GeneralStats from './components/general-stats';
import { ChartBar } from 'lucide-react';
import LastBooksGraph from './components/last-books-graph';
import LastbooksList from './components/last-books-list';
import { Book } from '@/types/Book';
import { getMyStats } from '@/services/StatsService';

async function StatsPage() {
  const { data } = await getMyStats();
  if (!data) {
    return <div>No stats found</div>;
  }

  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <h1 className='text-xl text-white font-semibold underline decoration-primary'>
          My Reading stats
        </h1>
        <ChartBar />
      </header>
      <GeneralStats book={data.book} page={data.page} tag={data.tag} />
      <LastBooksGraph
        last6MonthsReadedBooks={data.last6MonthsReadedBooks as Book[]}
      />
      <LastbooksList books={data.last6MonthsReadedBooks as Book[]} />
    </div>
  );
}

export default StatsPage;
