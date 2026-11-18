'use client';

import { BookHighlightWithBook } from '@/types/BookHighlight';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash, BookOpen } from 'lucide-react';
import { deleteBookHighlight } from '@/services/BookHighlightService';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

interface HighlightCardProps {
  highlight: BookHighlightWithBook;
}

function HighlightCard({ highlight }: HighlightCardProps) {
  const handleDelete = async () => {
    try {
      await deleteBookHighlight(highlight.highlight_id);
      toast.success('Highlight deleted');
    } catch {
      toast.error('Failed to delete highlight');
    }
  };

  const formattedDate = new Date(highlight.created_at).toLocaleDateString(
    'es-ES',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <article className='group relative min-w-0 rounded-xl bg-surface-container border border-border/50 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'>
      {/* Book info header */}
      <Link
        href={`/book/${highlight.google_id}`}
        className='flex items-start gap-3 mb-4'
      >
        <div className='relative shrink-0 w-12 h-16 rounded-md overflow-hidden bg-muted shadow-md'>
          {highlight.thumbnail_url ? (
            <Image
              src={highlight.thumbnail_url}
              alt={highlight.title}
              fill
              className='object-cover'
              sizes='48px'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <BookOpen className='w-5 h-5 text-muted-foreground' />
            </div>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <h2 className='text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors min-[1024px]:line-clamp-2 min-[1024px]:whitespace-normal'>
            {highlight.title}
          </h2>
          <p className='text-xs text-muted-foreground truncate'>
            {highlight.author}
          </p>
        </div>
      </Link>

      {/* Highlight text */}
      <div className='relative pl-4 border-l-2 border-primary/40 mb-4'>
        <blockquote className='text-base leading-relaxed text-foreground/90 italic wrap-anywhere min-[1024px]:not-italic'>
          &ldquo;{highlight.highlight_text}&rdquo;
        </blockquote>
      </div>

      {/* Footer with metadata and actions */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='secondary' className='shrink-0 text-xs font-normal'>
            Page {highlight.page}
          </Badge>
          <time className='text-xs text-muted-foreground'>{formattedDate}</time>
        </div>
        <Button
          aria-label={`Delete highlight from ${highlight.title}`}
          onClick={handleDelete}
          variant='ghost'
          size='icon'
          className='size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 min-[1024px]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-opacity'
        >
          <Trash className='w-4 h-4' />
        </Button>
      </div>
    </article>
  );
}

export default HighlightCard;
