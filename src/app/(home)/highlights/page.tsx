export const dynamic = 'force-dynamic';

import { Highlighter } from 'lucide-react';
import { getAllHighlights } from '@/services/BookHighlightService';
import HighlightsList from './components/highlights-list';

async function HighlightsPage() {
  const result = await getAllHighlights();
  const highlights = result.data || [];

  return (
    <div>
      <header className='flex justify-between items-center gap-2 p-4'>
        <div className='flex items-center gap-3'>
          <h1 className='text-xl text-white font-semibold underline decoration-primary'>
            My Highlights
          </h1>
          {highlights.length > 0 && (
            <span className='text-sm text-muted-foreground'>
              ({highlights.length})
            </span>
          )}
        </div>
        <Highlighter className='w-5 h-5 text-primary' />
      </header>
      <div className='px-4 pb-4'>
        <HighlightsList highlights={highlights} />
      </div>
    </div>
  );
}

export default HighlightsPage;
