import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import readitLogo from '../../../../public/readit-logo.png';
import BooksList from '@/components/book/books-list';
import Container from '@/components/ui/container';
import booksSearcher from '@/services/repositories/BooksSearcher';

async function Preview() {
  const fiction = await booksSearcher.getBooksBySubject('fiction');
  const fantasy = await booksSearcher.getBooksBySubject('fantasy');
  const thriller = await booksSearcher.getBooksBySubject('thriller');

  return (
    <div className='space-y-4 p-4'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-4'>
          <Image
            src={readitLogo}
            width={75}
            height={75}
            alt='read-it logo'
            className='shrink-0 rounded-xl'
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
          books={fiction}
          cardMode='vertical'
          opts={{ dragFree: true }}
        />
      </section>
      <section>
        <span className='text-xl font-semibold'>Fantasy 🧙‍♂️</span>
        <BooksList
          books={fantasy}
          cardMode='vertical'
          opts={{ dragFree: true }}
        />
      </section>
      <section>
        <span className='text-xl font-semibold'>Thrillers 🤔</span>
        <BooksList
          books={thriller}
          cardMode='vertical'
          opts={{ dragFree: true }}
        />
      </section>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Container>
      <Preview />
    </Container>
  );
}
