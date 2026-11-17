'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import {
  BadgeCheck,
  BookIcon,
  Bookmark,
  BookOpen,
  Calendar,
  ChevronDown,
  NotebookText,
  Tablet,
  Trash,
} from 'lucide-react';
import { toast } from 'sonner';
import { Book, BookStatus, BookStatusDictionary } from '@/types/Book';
import type { BookHighlightPreview } from '@/types/BookHighlight';
import type { Result } from '@/types/Result';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  removeFromLibrary,
  updateBookDates,
  updateBookStatus,
  updateBookType,
} from '@/services/BookService';
import DatePicker from '@/components/date-picker';
import type { DateRange } from '@/components/date-picker/types';
import datesHelper from '@/services/helpers/DatesHelper';
import HighlightsModal from '@/components/book/highlights-modal';

const desktopQuery = '(min-width: 64rem)';

function subscribeToDesktop(onChange: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

const readingStatuses = [
  { value: BookStatus.WANT_TO_READ, Icon: Bookmark },
  { value: BookStatus.READING, Icon: BookOpen },
  { value: BookStatus.READ, Icon: BadgeCheck },
];

const bookTypes = [
  { value: '1', label: 'Electronic', Icon: Tablet },
  { value: '2', label: 'Physical', Icon: BookIcon },
];

type BookDialog = 'dates' | 'highlights';
type PendingChange = BookStatus | 'type' | 'remove';

type BookMenuOptions = {
  book: Book;
  pending: PendingChange | null;
  changeStatus: (status: BookStatus) => Promise<boolean>;
  changeType: (type: string) => Promise<boolean>;
  remove: () => Promise<boolean>;
  openDialog: (dialog: BookDialog) => void;
};

function MobileBookMenu({
  book,
  pending,
  changeStatus,
  changeType,
  remove,
  openDialog,
}: BookMenuOptions) {
  const [open, setOpen] = useState(false);

  async function closeOnSuccess(change: Promise<boolean>) {
    if (await change) setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button aria-label='Reading options'>
          <ChevronDown aria-hidden='true' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex items-center gap-2 text-lg font-semibold'>
            {book.title}
          </DrawerTitle>
          <DrawerDescription className='text-left'>{book.authors}</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col items-start gap-2 px-4 pb-4'>
          {readingStatuses.map(({ value, Icon }) => {
            const active = book.id_book_status === value;
            return (
              <Button
                key={value}
                className='w-full justify-start rounded-lg'
                variant={active ? 'secondary' : 'ghost'}
                startIcon={<Icon className={active ? 'fill-accent' : undefined} />}
                isLoading={pending === value}
                disabled={pending !== null}
                onClick={() => closeOnSuccess(changeStatus(value))}
              >
                {BookStatusDictionary[value]}
              </Button>
            );
          })}
          <Button
            className='w-full justify-start'
            variant='destructive'
            startIcon={<Trash />}
            isLoading={pending === 'remove'}
            disabled={pending !== null}
            onClick={() => closeOnSuccess(remove())}
          >
            Remove
          </Button>
          <Separator />
          <Button
            className='w-full justify-start rounded-lg'
            variant='ghost'
            startIcon={<Calendar />}
            onClick={() => openDialog('dates')}
          >
            Dates read
          </Button>
          <Button
            className='w-full justify-start rounded-lg'
            variant='ghost'
            startIcon={<NotebookText />}
            onClick={() => openDialog('highlights')}
          >
            Highlights
          </Button>
          <Separator />
          <span className='text-sm'>Book Type</span>
          <RadioGroup
            value={String(book.book_type_id)}
            disabled={pending !== null}
            className='space-y-2'
            onValueChange={(value) => closeOnSuccess(changeType(value))}
          >
            {bookTypes.map(({ value, label, Icon }) => (
              <div key={value} className='flex items-center space-x-2'>
                <RadioGroupItem value={value} id={'book-type-' + value} />
                <Label htmlFor={'book-type-' + value} className='flex items-center gap-1'>
                  <Icon size={16} />
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function BookMenu({ book, highlights }: { book: Book; highlights: BookHighlightPreview[] }) {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(desktopQuery).matches,
    () => false,
  );
  const [dialog, setDialog] = useState<BookDialog | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [isSavingDates, setIsSavingDates] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const nextDialog = useRef<BookDialog | null>(null);
  const canChangeBook = pending === null;

  async function changeBook(
    action: PendingChange,
    update: () => Promise<Result<unknown>>,
  ) {
    setPending(action);
    try {
      const result = await update();
      if (!result.success) {
        toast.error(result.error ?? 'Could not update the book.');
        return false;
      }
      if (action === 'type' && typeof result.data === 'string') {
        toast.success(result.data);
      }
      return true;
    } catch {
      toast.error('Could not update the book.');
      return false;
    } finally {
      setPending(null);
    }
  }

  const changeStatus = (status: BookStatus) =>
    changeBook(status, () => updateBookStatus(status, book.google_id));
  const changeType = (type: string) =>
    changeBook('type', () => updateBookType(Number(type), book.google_id));
  const remove = () =>
    changeBook('remove', () => removeFromLibrary(book.google_id));

  async function handleSaveDates(range: DateRange) {
    setIsSavingDates(true);
    try {
      const { success, data, error } = await updateBookDates(book.google_id, {
        from: range.from ? datesHelper.getDateNormalized(range.from) : null,
        to: range.to ? datesHelper.getDateNormalized(range.to) : null,
      });
      if (!success) {
        toast.error(error ?? 'Could not save reading dates.');
        return;
      }
      toast.success(data);
      setDialog(null);
    } catch {
      toast.error('Could not save reading dates.');
    } finally {
      setIsSavingDates(false);
    }
  }

  function restoreDesktopFocus(event: Event) {
    event.preventDefault();
    trigger.current?.focus();
  }

  return (
    <>
      {isDesktop ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button ref={trigger} aria-label='Reading options' className='h-10'>
              <ChevronDown aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            sideOffset={8}
            className='w-56 rounded-2xl border-outline-variant bg-surface-container-high p-2'
            onCloseAutoFocus={(event) => {
              if (nextDialog.current) {
                event.preventDefault();
                setDialog(nextDialog.current);
                nextDialog.current = null;
              }
            }}
          >
            <DropdownMenuLabel>Reading status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              aria-label='Reading status'
              value={String(book.id_book_status)}
              onValueChange={(value) => void changeStatus(Number(value))}
            >
              {readingStatuses.map(({ value, Icon }) => (
                <DropdownMenuRadioItem key={value} value={String(value)} disabled={!canChangeBook}>
                  <Icon aria-hidden='true' />
                  {BookStatusDictionary[value]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => { nextDialog.current = 'dates'; }}>
                <Calendar aria-hidden='true' />
                Dates read
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { nextDialog.current = 'highlights'; }}>
                <NotebookText aria-hidden='true' />
                Highlights
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Book type</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              aria-label='Book type'
              value={String(book.book_type_id)}
              onValueChange={(value) => void changeType(value)}
            >
              {bookTypes.map(({ value, label, Icon }) => (
                <DropdownMenuRadioItem key={value} value={value} disabled={!canChangeBook}>
                  <Icon aria-hidden='true' />
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' disabled={!canChangeBook} onSelect={() => void remove()}>
              <Trash aria-hidden='true' />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <MobileBookMenu
          book={book}
          pending={pending}
          changeStatus={changeStatus}
          changeType={changeType}
          remove={remove}
          openDialog={setDialog}
        />
      )}
      <DatePicker
        isOpen={dialog === 'dates'}
        onOpenChange={(open) => setDialog(open ? 'dates' : null)}
        onSubmit={handleSaveDates}
        book={book}
        defaultValue={{
          from: book.start_date ? new Date(book.start_date) : undefined,
          to: book.finish_date ? new Date(book.finish_date) : undefined,
        }}
        isWorking={isSavingDates}
        onCloseAutoFocus={isDesktop ? restoreDesktopFocus : undefined}
      />
      <HighlightsModal
        book={book}
        highlights={highlights}
        isOpen={dialog === 'highlights'}
        onOpenChange={(open) => setDialog(open ? 'highlights' : null)}
        onCloseAutoFocus={isDesktop ? restoreDesktopFocus : undefined}
      />
    </>
  );
}

export default BookMenu;
