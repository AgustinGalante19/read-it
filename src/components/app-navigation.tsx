import { ChartBar, Highlighter, Home, LibraryBig, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const destinations = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'Search', href: '/search', Icon: Search },
  { label: 'Library', href: '/library', Icon: LibraryBig },
  { label: 'Highlights', href: '/highlights', Icon: Highlighter },
  { label: 'Stats', href: '/stats', Icon: ChartBar },
];

export default function AppNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label='Main navigation'
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 h-(--bottom-bar-height) border-t border-outline-variant bg-surface-container',
        'pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]',
        'min-[600px]:static min-[600px]:h-auto min-[600px]:self-start min-[600px]:border-0 min-[600px]:bg-transparent min-[600px]:p-0',
        '[@media(min-width:600px)_and_(min-height:440px)]:sticky [@media(min-width:600px)_and_(min-height:440px)]:top-[env(safe-area-inset-top,0px)]',
      )}
    >
      <ul className='grid h-full grid-cols-5 items-center min-[600px]:h-auto min-[600px]:grid-cols-1 min-[600px]:gap-1 min-[600px]:p-2 min-[1024px]:px-3'>
        {destinations.map(({ label, href, Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className='min-w-0'>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group mx-0.5 flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-medium transition-colors duration-150',
                  'min-[600px]:min-h-14 min-[600px]:gap-1',
                  'min-[1024px]:mx-0 min-[1024px]:min-h-12 min-[1024px]:flex-row min-[1024px]:justify-start min-[1024px]:gap-4 min-[1024px]:px-4 min-[1024px]:text-sm',
                  isActive
                    ? 'text-primary min-[1024px]:bg-primary-container min-[1024px]:text-primary-container-foreground'
                    : 'text-muted-foreground min-[1024px]:hover:bg-foreground/8 min-[1024px]:active:bg-foreground/12',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-14 place-items-center rounded-full transition-colors duration-150 min-[600px]:h-8 min-[1024px]:size-auto',
                    isActive
                      ? 'bg-primary-container text-primary-container-foreground min-[1024px]:bg-transparent'
                      : 'group-hover:bg-foreground/8 group-active:bg-foreground/12 min-[1024px]:group-hover:bg-transparent min-[1024px]:group-active:bg-transparent',
                  )}
                >
                  <Icon aria-hidden='true' className='size-5' />
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
