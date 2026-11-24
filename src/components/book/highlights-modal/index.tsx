'use client';

import { BookHighlightPreview } from '@/types/BookHighlight';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import HighlightActions from '@/components/book/highlight-actions';
import HighlightTabs from '@/components/book/highlight-tabs';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Book } from '@/types/Book';
const HighlightItem = ({ highlight }: { highlight: BookHighlightPreview }) => {
  return (
    <div className='flex min-w-0 flex-col gap-3'>
      <div className='relative min-w-0 pl-4 border-l-4 border-primary/20'>
        {highlight.is_note ? (
          <p className='text-base leading-relaxed whitespace-pre-line wrap-anywhere'>{highlight.highlight_text}</p>
        ) : (
          <blockquote className='text-base leading-relaxed whitespace-pre-line wrap-anywhere'>
            &ldquo;{highlight.highlight_text}&rdquo;
          </blockquote>
        )}
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2'>
        <Badge variant='secondary' className='text-xs font-normal'>
          Page {highlight.page}
        </Badge>
        <time className='text-xs text-muted-foreground'>
          {new Date(highlight.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
        <HighlightActions highlight={highlight} />
      </div>
    </div>
  );
};

function HighlightGroup({ highlights, isNote }: { highlights: BookHighlightPreview[]; isNote: boolean }) {
  if (!highlights.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{isNote ? 'No notes yet' : 'No quotes yet'}</EmptyTitle>
          <EmptyDescription>
            {isNote ? 'Notes to research later will appear here.' : 'Quotes saved from this book will appear here.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <ScrollArea className='max-h-[60vh] [&_[data-slot=scroll-area-viewport]]:max-h-[60vh]'>
      <div className='flex flex-col gap-6 pr-3'>
        {highlights.map((highlight) => <HighlightItem key={highlight.highlight_id} highlight={highlight} />)}
      </div>
    </ScrollArea>
  );
}

function HighlightsModal({
  highlights,
  isOpen: open,
  onOpenChange,
  onCloseAutoFocus,
  book,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
  highlights: BookHighlightPreview[];
  book: Book | null | undefined;
}) {
  if (!book) return null;
  const quotes = highlights.filter((highlight) => !highlight.is_note);
  const notes = highlights.filter((highlight) => highlight.is_note);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl' onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader className='text-start'>
          <DialogTitle className='text-xl'>{book?.title}</DialogTitle>
          <DialogDescription className='text-base'>
            {book?.authors}
          </DialogDescription>
        </DialogHeader>

        <HighlightTabs
          quoteCount={quotes.length}
          noteCount={notes.length}
          quotes={<HighlightGroup highlights={quotes} isNote={false} />}
          notes={<HighlightGroup highlights={notes} isNote />}
        />
      </DialogContent>
    </Dialog>
  );
}

export default HighlightsModal;
