import Topbar from '@/components/topbar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import BookCard from '@/components/book/book-card';
import { getMyBooks } from '@/services/Library';

export default async function Home() {
  const readList = await getMyBooks('notReaded');
  const readedBooks = await getMyBooks('readed');

  return (
    <main>
      <Topbar />
      <div className='container mx-auto p-4 space-y-8'>
        <section>
          <h3 className='font-semibold text-2xl'>My Readlist</h3>
          <Carousel
            opts={{
              align: 'start',
              dragFree: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-2'>
              {readList.result.map((book) => (
                <div key={book.id} className='pr-2'>
                  <CarouselItem className='pl-2 basis-1/3'>
                    <BookCard book={book} mode='vertical' />
                  </CarouselItem>
                </div>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        <section>
          <h3 className='font-semibold text-2xl'>Readed</h3>
          <Carousel
            opts={{
              align: 'start',
            }}
            className='w-full max-w-sm'
          >
            <CarouselContent className='-ml-2'>
              {readedBooks.result.map((book) => (
                <div className='pr-2' key={book.id}>
                  <CarouselItem className='pl-2'>
                    <BookCard book={book} />
                  </CarouselItem>
                </div>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    </main>
  );
}
