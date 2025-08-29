import BooksList from '@/components/book/books-list';
import { mapBooksArray } from '@/lib/mapBookObject';
import { getBooksBySubject } from '@/services/GoogleBooks';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function PreviewPage() {
  const fiction = await getBooksBySubject('fiction');
  const fantasy = await getBooksBySubject('fantasy');
  const thriller = await getBooksBySubject('thriller');

  return (
    <div className='space-y-4 p-4'>
      <div className='blur-background blur-background-green -mt-32' />
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-4'>
          <Image
            src='/book-nexus-logo.svg'
            width={25}
            height={50}
            alt='read-it logo'
          />
          <h1 className='text-white font-bold text-3xl text-center'>
            Welcome to Read-It
          </h1>
        </div>
        <span className='text-center block text-gray-400 font-semibold'>
          Get track of your books read an to read! totally free and an easy way
        </span>
      </div>
      <div className='flex items-center justify-between pt-4'>
        <Link href='/sign-in' className='flex items-center underline gap-1'>
          Sign In <LogIn size={20} />
        </Link>
      </div>
      <section>
        <span className='text-xl font-semibold'>Fiction 🚀</span>
        <BooksList
          books={mapBooksArray(fiction.items)}
          cardMode='vertical'
          opts={{ dragFree: true }}
        />
      </section>
      <section>
        <span className='text-xl font-semibold'>Fantasy 🧙‍♂️</span>
        <BooksList
          books={mapBooksArray(fantasy.items)}
          cardMode='vertical'
          opts={{ dragFree: true }}
        />
      </section>
      <section>
        <span className='text-xl font-semibold'>Thrillers 🤔</span>
        <BooksList
          books={mapBooksArray(thriller.items)}
          cardMode='vertical'
          opts={{ dragFree: true }}
        />
      </section>
    </div>
  );
}

export default PreviewPage;
