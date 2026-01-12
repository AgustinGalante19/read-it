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

const HighlightItem = ({ highlight }: { highlight: BookHighlightPreview }) => {
  return (
    <div className='space-y-3'>
      <div className='relative pl-4 border-l-4 border-primary/20'>
        <blockquote className='text-base leading-relaxed'>
          &quot;{highlight.highlight_text}&quot;
        </blockquote>
      </div>

      <div className='flex items-center justify-between gap-2'>
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
      </div>
    </div>
  );
};

function HighlightsModal({
  highlights,
  isOpen: open,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  highlights: BookHighlightPreview[];
}) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start space-y-1'>
          <DialogTitle className='text-xl'>{highlights[0].title}</DialogTitle>
          <DialogDescription className='text-base'>
            {highlights[0].author}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[60vh] pr-4'>
          <div className='space-y-6'>
            {highlights.map((highlight, index) => (
              <div key={highlight.id}>
                <HighlightItem highlight={highlight} />
              </div>
            ))}
          </div>
        </ScrollArea>

        {highlights.length > 1 && (
          <div className='text-center text-sm text-muted-foreground pt-2'>
            {highlights.length}{' '}
            {highlights.length === 1 ? 'highlight' : 'highlights'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default HighlightsModal;
