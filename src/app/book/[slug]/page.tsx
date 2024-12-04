import BackButton from '@/components/ui/back-button';
import { getDateString } from '@/lib/date-utils';
import { getBook } from '@/services/GoogleBooks';
import { BookText, Calendar, Minus } from 'lucide-react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import getAuthorsString from '@/lib/getAuthorsString';
import AddBook from '../components/AddBook';
import Categories from './sections/categories';

async function BookPerId({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const book = await getBook(slug);

  const sanitizedContent = DOMPurify.sanitize(
    book.volumeInfo?.description || '<p>Description not provided</p>',
    {
      USE_PROFILES: { html: true },
    }
  );

  return (
    <article>
      <header className='flex h-[320px] justify-center items-end relative w-full pb-4'>
        <div
          style={{
            backgroundImage: `url(${
              book.volumeInfo.imageLinks?.thumbnail ||
              '/small-thumbnail-fallback.jpg'
            })`,
          }}
          className={`absolute w-full h-full bg-center bg-cover bg-no-repeat filter blur-[10px] brightness-75 z-[-1] top-0 left-0 mask-image-[linear-gradient(#393b3b_90%,_transparent)]`}
        />
        <Image
          alt={`${book.volumeInfo.title} cover`}
          src={
            book.volumeInfo.imageLinks?.smallThumbnail ||
            '/small-thumbnail-fallback.jpg'
          }
          width={128}
          height={194}
          style={{ width: 128, height: 194 }}
          className='blur-bottom-image'
        />
      </header>
      <div className='p-4 text-white mb-3'>
        <div className='flex items-center gap-4 mt-2'>
          <BackButton />
          <h2 className='font-bold text-2xl'>{book.volumeInfo.title}</h2>
        </div>
        <div className='flex justify-between items-center'>
          <span className='font-semibold'>
            {getAuthorsString(book.volumeInfo?.authors)}
          </span>
          <AddBook book={book} />
        </div>
        <Categories categories={book.volumeInfo?.categories} />
        <div className='grid grid-cols-3 bg-dark-blue items-center justify-between rounded-lg px-8 py-2 mb-6'>
          <span className='text-center text-sm font-bold flex items-center justify-center gap-2'>
            <Calendar size={20} />
            {getDateString(book.volumeInfo.publishedDate)}
          </span>
          <span className='text-center'>
            <Minus className='mx-auto rotate-90' size={30} />
          </span>
          <span className='text-center text-sm font-bold flex items-center justify-center gap-2'>
            <BookText size={20} />
            {book.volumeInfo.pageCount}
          </span>
        </div>
        <h3 className='text-lg font-bold mb-2'>About this book</h3>
        <section
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />
      </div>
    </article>
  );
}

export default BookPerId;
