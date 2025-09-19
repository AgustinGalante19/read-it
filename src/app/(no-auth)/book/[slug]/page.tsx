import BackButton from '@/components/ui/back-button';
import { BookText, Calendar, Minus } from 'lucide-react';
import Image from 'next/image';
import Categories from './components/categories';
import LibraryActions from './components/library-actions';
import { Metadata } from 'next';
import BookDescription from './components/book-description';
import { existsOnLibrary } from '@/services/BookService';
import datesHelper from '@/services/helpers/DatesHelper';
import bookHelper from '@/services/helpers/BookHelper';
import Link from 'next/link';
import booksSearcher from '@/services/repositories/BooksSearcher';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const book = await booksSearcher.getById(slug);

  if (!book) {
    return {
      title: 'Book Not Found',
      description: 'The requested book could not be found',
    };
  }

  return {
    title: `${book.title} - ${book.authors}`,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.thumbnail_url || '/small-thumbnail-fallback.jpg'],
    },
  };
}

async function BookPerId({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const book = await booksSearcher.getById(slug);
  const dbBook = await existsOnLibrary(book.google_id);

  return (
    <article>
      <header className='flex h-[320px] justify-center items-end relative w-full pb-4'>
        <div
          style={{
            backgroundImage: `url(${
              book.thumbnail_url || '/small-thumbnail-fallback.jpg'
            })`,
          }}
          className={`absolute w-full h-full bg-center bg-cover bg-no-repeat filter blur-[10px] brightness-75 z-[-1] top-0 left-0 mask-image-[linear-gradient(#393b3b_90%,_transparent)]`}
        />
        <Image
          alt={`${book.title} cover`}
          src={book.thumbnail_url || '/small-thumbnail-fallback.jpg'}
          width={128}
          height={205}
          className='blur-bottom-image'
        />
      </header>
      <div className='p-4 text-white mb-3'>
        <div className='flex justify-between items-center gap-4 mt-2'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <BackButton />
              <h2 className='font-bold text-2xl'>{book.title}</h2>
            </div>
            <span className='font-semibold'>
              {bookHelper.getBookAuthors(book.authors)}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <Link
            className='text-accent-foreground underline'
            target='_blank'
            href={`https://annas-archive.org/search?${new URLSearchParams({
              q: `${book.title} ${bookHelper.getBookAuthors(book.authors)}`,
            })}`}
          >
            Search on Anna&apos;s Archive
          </Link>
          <LibraryActions dbBook={dbBook.data} googleBook={book} />
        </div>
        <Categories categories={book.tags.split('/')} />

        <div className='grid grid-cols-2 bg-secondary items-center justify-between rounded-full py-2 mb-6 relative'>
          <div>
            <span className='text-center text-sm flex items-center justify-center gap-2 text-secondary-foreground'>
              <Calendar size={20} className='max-sm:hidden' />
              {datesHelper.getDateString(book.publish_date)}
            </span>
          </div>
          <Minus
            className='mx-auto rotate-90 absolute inset-x-0 text-secondary-foreground'
            size={20}
          />
          <div>
            <span className='text-center text-sm flex items-center justify-center gap-2 text-secondary-foreground'>
              <BookText size={20} />
              {book.page_count}
            </span>
          </div>
        </div>
        <h3 className='text-lg font-bold mb-2'>About this book</h3>
        <BookDescription
          description={book?.description || '<p>Description not provided</p>'}
        />
      </div>
    </article>
  );
}

export default BookPerId;
