import GeneralStats from './components/general-stats';
import { ChartBar } from 'lucide-react';
import LastBooksGraph from './components/last-books-graph';
import LastbooksList from './components/last-books-list';
import { getMyStats } from '@/services/Library';
import { Book } from '@/types/Book';

async function StatsPage() {
  const { result } = await getMyStats();

  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <h1 className='text-xl text-white font-semibold underline decoration-primary'>
          My Reading stats
        </h1>
        <ChartBar />
      </header>
      <GeneralStats book={result.book} page={result.page} tag={result.tag} />
      <LastBooksGraph
        last6MonthsReadedBooks={result.last6MonthsReadedBooks as Book[]}
      />
      <LastbooksList books={result.last6MonthsReadedBooks as Book[]} />
    </div>
  );
}

export default StatsPage;
