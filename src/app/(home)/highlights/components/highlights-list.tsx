import { BookHighlightWithBook } from '@/types/BookHighlight';
import HighlightCard from './highlight-card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Highlighter, NotebookPen } from 'lucide-react';
import HighlightTabs from '@/components/book/highlight-tabs';
import Link from 'next/link';
import { highlightsColumnsClassName } from './highlights-layout';

interface HighlightsListProps {
  highlights: BookHighlightWithBook[];
}

function HighlightGroup({ highlights, isNote }: HighlightsListProps & { isNote: boolean }) {
  if (highlights.length === 0) {
    return (
      <Empty className='mt-8'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            {isNote ? <NotebookPen /> : <Highlighter />}
          </EmptyMedia>
          <EmptyTitle>{isNote ? 'No notes yet' : 'No quotes yet'}</EmptyTitle>
          <EmptyDescription>
            {isNote
              ? 'Save a painting, a place, or an idea from your books to research later.'
              : 'Save passages manually or sync your highlights from KOReader.'}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href='/library'>Go to Library</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className={highlightsColumnsClassName}>
      {highlights.map((highlight) => (
        <HighlightCard key={highlight.highlight_id} highlight={highlight} />
      ))}
    </div>
  );
}

function HighlightsList({ highlights }: HighlightsListProps) {
  const quotes = highlights.filter((highlight) => !highlight.is_note);
  const notes = highlights.filter((highlight) => highlight.is_note);
  return (
    <HighlightTabs
      quoteCount={quotes.length}
      noteCount={notes.length}
      quotes={<HighlightGroup highlights={quotes} isNote={false} />}
      notes={<HighlightGroup highlights={notes} isNote />}
    />
  );
}

export default HighlightsList;
