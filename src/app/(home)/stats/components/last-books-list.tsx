import BookCover from '@/components/book/book-cover';
import ShowAll from '@/components/book/show-all';
import { Book, BookStatus } from '@/types/Book';
import Link from 'next/link';

export default function LastbooksList({ books }: { books: Book[] }) {
  return (
    <section aria-label='Latest reads' className='flex min-w-0 flex-col gap-4'>
      <ShowAll label='Latest reads' readStatus={BookStatus.READ} heading='h2' />
      {books.length ? (
        <ul className='grid gap-x-6 gap-y-5 min-[600px]:grid-cols-2 min-[1280px]:grid-cols-3'>
          {books.map((book) => (
            <li key={book.id} className='min-w-0'>
              <Link href={`/book/${book.google_id}`} className='group flex items-start gap-4 rounded-sm'>
                <BookCover src={book.thumbnail_url} sizes='48px' className='w-12 shrink-0' />
                <div className='flex min-w-0 flex-col gap-1'>
                  <h3 className='line-clamp-2 text-sm/5 font-medium wrap-anywhere group-hover:text-primary'>{book.title}</h3>
                  <p className='line-clamp-2 text-sm/5 text-muted-foreground wrap-anywhere'>{book.authors}</p>
                  {book.finish_date && <time dateTime={book.finish_date} className='text-xs/5 text-muted-foreground'>Finished {new Date(book.finish_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : <p className='text-sm/6 text-muted-foreground'>No books completed in the last 6 months.</p>}
    </section>
  );
}
