import BookCard from '@/components/book/book-card';
import MOCK_BOOK from '@/lib/mockbook';

export default async function Home() {
  return (
    <div className='container mx-auto max-sm:p-4 space-y-8'>
      <section>
        <h3 className='font-semibold text-2xl'>My Readlist</h3>
        <div className='flex gap-4 my-2'>
          <BookCard book={MOCK_BOOK} mode='vertical' />
          <BookCard book={MOCK_BOOK} mode='vertical' />
        </div>
      </section>
      <section>
        <h3 className='font-semibold text-2xl my-2'>Readed</h3>
        <div className='flex gap-4 overflow-y-auto'>
          <BookCard book={MOCK_BOOK} />
          <BookCard book={MOCK_BOOK} />
        </div>
      </section>
    </div>
  );
}
