import BookCard from '@/components/book/book-card';

const MOCK_BOOK = {
  kind: 'books#volume',
  id: 'qTbDDwAAQBAJ',
  etag: 'YF6PBimCJGk',
  selfLink: 'https://www.googleapis.com/books/v1/volumes/qTbDDwAAQBAJ',
  volumeInfo: {
    title: '1793 (Trilogía de Estocolmo 1)',
    authors: ['Niklas Natt och Dag'],
    publisher: 'SALAMANDRA',
    publishedDate: '2020-01-16',
    description:
      'El fenómeno de ventas que ha revolucionado el thriller histórico. Premiado en Suecia como Mejor Libro del Año y considerado mejor debut por la Academia Sueca de Novela Negra en 2017, 1793 es un apasionante thriller histórico que se ha convertido en un fenómeno de ventas en toda Europa. Un año después de la muerte del rey Gustavo III, los vientos de la Revolución francesa llegan incluso a Suecia, donde la tensión es palpable en todo el país, convertido en un nido de conspiraciones, suspicacias y recelos. En esta atmósfera irrespirable, Mickel Cardell, un veterano de la guerra contra Rusia, descubre un cuerpo atrozmente mutilado en un lago de Estocolmo. Un abogado tuberculoso, el sagaz e incorruptible Cecil Winge, se hace cargo de las pesquisas, pero el tiempo apremia: su salud es precaria, la monarquía hace aguas y las revueltas están a la orden del día. Winge y Cardell se verán inmersos en un mundo de truhanes y ladrones, ricos y pobres, piadosos y pecadores, mercenarios y meretrices. Juntos se enfrentarán al mal y a la corrupción que anidan en la sociedad sueca para esclarecer la misteriosa verdad escondida tras ese terrible crimen. Intenso, descarnado y febril, 1793 insufla vida a las calles abarrotadas, los suntuosos palacios y los rincones más sombríos de la capital sueca a finales del siglo XVIII, y nos ofrece una sorprendente visión de los delitos que cometemos en nombre de la justicia y los sacrificios que hacemos para sobrevivir. La crítica ha dicho... «Maravillosamente escrita y bien construida, esta novela nos arrastra, con las descripciones de lugares y personajes, a un viaje que no termina hasta que se ha leído la última escena». De Standaard «Apasionante, perturbadora, inteligente y hermosa». Fredrik Backman «Una novela dura, violenta, compleja, fascinante. [...] El mejor thriller histórico que he leído en los últimos veinte años». A. J. Finn «En su debut novelístico, Natt och Dag examina los efectos de un brutal asesinato y a sus investigadores, y explora las causas psicológicas del crimen. Escalofriante y profunda, implacable, muy bien escrita, es casi imposible dejarla». Kirkus Reviews «Una primera novela magistral». Publishers Weekly «Este apasionante thrillerhistórico anuncia la llegada de un nuevo talento europeo. Una novela vívida y absorbente». The Observer «Absolutamente impresionante». Dagens Nyheter «Un tour de forceliterario, un libro inteligente e intrigante que el lector recordará mucho después de haberlo leído». Verdens Gang',
    industryIdentifiers: [
      {
        type: 'ISBN_13',
        identifier: '9788417384883',
      },
      {
        type: 'ISBN_10',
        identifier: '841738488X',
      },
    ],
    readingModes: {
      text: true,
      image: true,
    },
    pageCount: 402,
    printType: 'BOOK',
    categories: ['Fiction'],
    maturityRating: 'NOT_MATURE',
    allowAnonLogging: true,
    contentVersion: '0.4.3.0.preview.3',
    panelizationSummary: {
      containsEpubBubbles: false,
      containsImageBubbles: false,
    },
    imageLinks: {
      smallThumbnail:
        'http://books.google.com/books/content?id=qTbDDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      thumbnail:
        'http://books.google.com/books/content?id=qTbDDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    },
    language: 'es',
    previewLink:
      'http://books.google.com.ar/books?id=qTbDDwAAQBAJ&printsec=frontcover&dq=1793&hl=&cd=2&source=gbs_api',
    infoLink:
      'https://play.google.com/store/books/details?id=qTbDDwAAQBAJ&source=gbs_api',
    canonicalVolumeLink:
      'https://play.google.com/store/books/details?id=qTbDDwAAQBAJ',
  },
  saleInfo: {
    country: 'AR',
    saleability: 'FOR_SALE',
    isEbook: true,
    listPrice: {
      amount: 8.99,
      currencyCode: 'USD',
    },
    retailPrice: {
      amount: 8.99,
      currencyCode: 'USD',
    },
    buyLink:
      'https://play.google.com/store/books/details?id=qTbDDwAAQBAJ&rdid=book-qTbDDwAAQBAJ&rdot=1&source=gbs_api',
    offers: [
      {
        finskyOfferType: 1,
        listPrice: {
          amountInMicros: 8990000,
          currencyCode: 'USD',
        },
        retailPrice: {
          amountInMicros: 8990000,
          currencyCode: 'USD',
        },
      },
    ],
  },
  accessInfo: {
    country: 'AR',
    viewability: 'PARTIAL',
    embeddable: true,
    publicDomain: false,
    textToSpeechPermission: 'ALLOWED_FOR_ACCESSIBILITY',
    epub: {
      isAvailable: true,
      acsTokenLink:
        'http://books.google.com.ar/books/download/1793_Trilog%C3%ADa_de_Estocolmo_1-sample-epub.acsm?id=qTbDDwAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
    },
    pdf: {
      isAvailable: true,
      acsTokenLink:
        'http://books.google.com.ar/books/download/1793_Trilog%C3%ADa_de_Estocolmo_1-sample-pdf.acsm?id=qTbDDwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
    },
    webReaderLink:
      'http://play.google.com/books/reader?id=qTbDDwAAQBAJ&hl=&source=gbs_api',
    accessViewStatus: 'SAMPLE',
    quoteSharingAllowed: false,
  },
  searchInfo: {
    textSnippet:
      'A. J. Finn «En su debut novelístico, Natt och Dag examina los efectos de un brutal asesinato y a sus investigadores, y explora las causas psicológicas del crimen.',
  },
};

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
