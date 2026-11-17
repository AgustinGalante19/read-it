import { cache } from 'react';
import BackButton from '@/components/ui/back-button';
import BookCover from '@/components/book/book-cover';
import { BookText, Calendar, Minus } from 'lucide-react';
import Image from 'next/image';
import Categories from './components/categories';
import LibraryActions from './components/library-actions';
import { Metadata } from 'next';
import BookDescription from './components/book-description';
import { existsOnLibrary } from '@/services/BookService';
import datesHelper from '@/services/helpers/DatesHelper';
import bookHelper from '@/services/helpers/BookHelper';
import booksSearcher from '@/services/repositories/BooksSearcher';
import UserBookStats from './components/user-book-stats';
import { getBookHighlights } from '@/services/BookHighlightService';

const getBook = cache(async (slug: string) => {
  return booksSearcher.getById(slug);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const book = await getBook(slug);

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
  const book = await getBook(slug);
  const [dbBook, bookHighlights] = await Promise.all([
    existsOnLibrary(book.google_id),
    getBookHighlights(book.google_id),
  ]);
  const cover = dbBook.data?.thumbnail_url || book.thumbnail_url;
  const mobileCover = cover || '/small-thumbnail-fallback.jpg';
  const publicationDate = datesHelper.getDateString(book.publish_date);
  const pageCount = dbBook.data?.page_count || book.page_count;

  return (
    <>
      <div className='relative flex h-80 w-full items-end justify-center pb-4 lg:hidden'>
        <div
          style={{ backgroundImage: `url(${mobileCover})` }}
          className='absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat mask-image-[linear-gradient(#393b3b_90%,_transparent)] blur-[10px] brightness-75'
        />
        <Image
          alt={`${book.title} cover`}
          src={mobileCover}
          width={128}
          height={205}
          className='blur-bottom-image'
        />
      </div>
      <div className='hidden lg:block [@media(min-width:1024px)_and_(min-height:560px)]:sticky [@media(min-width:1024px)_and_(min-height:560px)]:top-8'>
        <BookCover src={cover} sizes='(min-width: 1280px) 272px, 240px' />
      </div>
      <div className='mb-3 space-y-2 p-4 text-white lg:mb-0 lg:flex lg:min-w-0 lg:flex-col lg:gap-5 lg:space-y-0 lg:p-0 lg:text-foreground'>
        <div className='mt-2 flex items-center gap-4 lg:mt-0'>
          <BackButton className='lg:absolute lg:-top-14 lg:left-0 lg:h-9 lg:rounded-full lg:px-4 lg:text-sm lg:font-medium lg:hover:bg-white/8'>
            <span className='hidden lg:inline'>Back</span>
          </BackButton>
          <h1 className='text-2xl font-bold lg:text-[40px]/[48px] lg:font-normal lg:wrap-anywhere'>
            {book.title}
          </h1>
        </div>
        <div className='flex items-center justify-between gap-2 lg:flex-wrap lg:gap-x-6 lg:gap-y-3'>
          <span className='font-semibold lg:min-w-0 lg:text-lg/7 lg:font-normal lg:text-muted-foreground lg:wrap-anywhere'>
            {bookHelper.getBookAuthors(book.authors)}
          </span>
          <LibraryActions
            dbBook={dbBook.data}
            googleBook={book}
            bookhighlights={bookHighlights.data || []}
          />
        </div>
        <UserBookStats userBookData={dbBook} />
        <Categories categories={book.tags ? book.tags.split('/') : []} />
        <div className='relative mb-6 grid grid-cols-2 items-center justify-between rounded-full bg-secondary py-2 lg:mb-0 lg:flex lg:flex-wrap lg:justify-start lg:gap-x-5 lg:gap-y-2 lg:rounded-none lg:bg-transparent lg:py-0'>
          <div>
            <span className='flex items-center justify-center gap-2 text-center text-sm text-secondary-foreground lg:text-muted-foreground'>
              <Calendar size={20} className='max-sm:hidden lg:size-4' aria-hidden='true' />
              <span>
                <span className='lg:hidden'>{publicationDate}</span>
                <span className='hidden lg:inline'>
                  {publicationDate === 'Not Provided'
                    ? 'Publication date unavailable'
                    : `Published ${publicationDate}`}
                </span>
              </span>
            </span>
          </div>
          <Minus
            className='absolute inset-x-0 mx-auto rotate-90 text-secondary-foreground lg:hidden'
            size={20}
            aria-hidden='true'
          />
          <div>
            <span className='flex items-center justify-center gap-2 text-center text-sm text-secondary-foreground lg:text-muted-foreground'>
              <BookText size={20} className='lg:size-4' aria-hidden='true' />
              <span className='lg:hidden'>{pageCount}</span>
              <span className='hidden lg:inline'>
                {pageCount > 0 ? `${pageCount} pages` : 'Page count unavailable'}
              </span>
            </span>
          </div>
        </div>
        <div className='contents lg:order-3 lg:block lg:border-t lg:border-outline-variant lg:pt-6'>
          <h2 className='mb-2 text-lg font-bold lg:mb-3 lg:text-xl/7 lg:font-medium'>
            About this book
          </h2>
          <BookDescription description={book.description ?? ''} />
        </div>
      </div>
    </>
  );
}

export default BookPerId;
