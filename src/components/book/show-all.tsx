import { BookStatus } from '@/types/Book';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  readStatus: BookStatus;
  label: string;
  heading?: 'h2' | 'h3';
}

function ShowAll({ readStatus, label, heading: Heading = 'h3' }: Props) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-x-2'>
      <Heading className={cn('font-medium text-foreground', Heading === 'h2' ? 'text-xl/7' : 'text-2xl')}>
        {label}
      </Heading>
      <Link
        href={{ pathname: '/library', query: { status: readStatus } }}
        aria-label={`Show All in ${label}`}
        className='flex min-h-12 items-center gap-1 rounded-full px-2 text-sm font-medium text-primary transition-colors duration-150 hover:bg-white/8 active:bg-white/12 min-[600px]:min-h-9'
      >
        Show All
        <ChevronRight aria-hidden='true' size={18} />
      </Link>
    </div>
  );
}

export default ShowAll;
