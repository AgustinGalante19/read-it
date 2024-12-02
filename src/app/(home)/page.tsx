import Topbar from '@/components/topbar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import BookCard from '@/components/book/book-card';
import MOCK_BOOK from '@/lib/mockbook';

export default function Home() {
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
            className='w-full max-w-sm'
          >
            <CarouselContent className='-ml-16'>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className='basis-1/3 pl-16'>
                  <BookCard book={MOCK_BOOK} mode='vertical' />
                </CarouselItem>
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
            <CarouselContent className='-ml-8'>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className='pl-8'>
                  <BookCard book={MOCK_BOOK} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    </main>
  );
}
