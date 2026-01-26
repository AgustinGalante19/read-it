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
import { Highlighter } from 'lucide-react';
import Link from 'next/link';

interface HighlightsListProps {
  highlights: BookHighlightWithBook[];
}

function HighlightsList({ highlights }: HighlightsListProps) {
  if (highlights.length === 0) {
    return (
      <Empty className='mt-8'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Highlighter />
          </EmptyMedia>
          <EmptyTitle>No highlights yet</EmptyTitle>
          <EmptyDescription>
            Start reading and highlighting passages from your books. Your
            highlights will appear here.
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
    <div className='flex flex-col gap-2'>
      {highlights.map((highlight) => (
        <HighlightCard key={highlight.highlight_id} highlight={highlight} />
      ))}
    </div>
  );
}

export default HighlightsList;
