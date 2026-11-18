import { CalendarDays, ChartBar, Highlighter, Home, LibraryBig, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import AccountMenu from './account-menu';

const destinations = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'Search', href: '/search', Icon: Search },
  { label: 'Library', href: '/library', Icon: LibraryBig },
  { label: 'Calendar', href: '/calendar', Icon: CalendarDays },
  { label: 'Highlights', href: '/highlights', Icon: Highlighter },
  { label: 'Stats', href: '/stats', Icon: ChartBar },
];

function NavigationList({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  const items = mobile ? destinations.filter(({ href }) => href !== '/highlights') : destinations;

  return (
    <ul className={mobile
      ? 'grid h-full grid-cols-5 items-center min-[600px]:hidden'
      : 'hidden grid-cols-1 gap-1 p-2 min-[600px]:grid min-[1024px]:px-3'}>
      {items.map(({ label, href, Icon }) => {
        const isPage = pathname === href;
        const isActive = isPage || (mobile && href === '/library' && pathname === '/highlights');

        return (
          <li key={href} className='min-w-0'>
            <Link
              href={href}
              aria-current={isPage ? 'page' : isActive ? 'location' : undefined}
              className={cn(
                'group mx-0.5 flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-medium transition-colors duration-150',
                'min-[600px]:min-h-14 min-[600px]:gap-1',
                'min-[1024px]:mx-0 min-[1024px]:min-h-9 min-[1024px]:flex-row min-[1024px]:justify-start min-[1024px]:gap-3 min-[1024px]:px-4 min-[1024px]:text-sm',
                isActive
                  ? 'text-primary min-[1024px]:bg-primary-container min-[1024px]:text-primary-container-foreground'
                  : 'text-muted-foreground min-[1024px]:hover:bg-foreground/8 min-[1024px]:active:bg-foreground/12',
              )}
            >
              <span className={cn(
                'grid h-7 w-14 place-items-center rounded-full transition-colors duration-150 min-[600px]:h-8 min-[1024px]:size-auto',
                isActive
                  ? 'bg-primary-container text-primary-container-foreground min-[1024px]:bg-transparent'
                  : 'group-hover:bg-foreground/8 group-active:bg-foreground/12 min-[1024px]:group-hover:bg-transparent min-[1024px]:group-active:bg-transparent',
              )}>
                <Icon aria-hidden='true' className='size-5 min-[1024px]:size-4.5' />
              </span>
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function AppNavigation({ pathname }: { pathname: string }) {
  return (
    <aside className={cn(
      'fixed inset-x-0 bottom-0 z-40 h-(--bottom-bar-height) border-t border-outline-variant bg-surface-container',
      'pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]',
      'min-[600px]:static min-[600px]:h-auto min-[600px]:self-start min-[600px]:border-0 min-[600px]:bg-transparent min-[600px]:p-0',
      '[@media(min-width:600px)_and_(max-width:1023px)_and_(min-height:440px)]:sticky [@media(min-width:600px)_and_(max-width:1023px)_and_(min-height:440px)]:top-[env(safe-area-inset-top,0px)]',
      'min-[1024px]:sticky min-[1024px]:top-[calc(4.5rem+env(safe-area-inset-top,0px))] min-[1024px]:flex min-[1024px]:h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] min-[1024px]:min-h-0 min-[1024px]:flex-col',
    )}>
      <nav aria-label='Main navigation' className='h-full min-[600px]:h-auto min-[1024px]:min-h-0 min-[1024px]:overflow-y-auto'>
        <NavigationList pathname={pathname} mobile />
        <NavigationList pathname={pathname} />
      </nav>
      <div className='hidden min-[1024px]:mt-auto min-[1024px]:block min-[1024px]:shrink-0 min-[1024px]:p-3'>
        <AccountMenu placement='sidebar' />
      </div>
    </aside>
  );
}
