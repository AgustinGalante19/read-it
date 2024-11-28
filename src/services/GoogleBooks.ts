import { GoogleBooksResponse } from '@/types/Book';

// const BASE_GOOGLE_API_URL = 'https://www.googleapis.com/books/v1';

const MOCK_RERSPONSE: GoogleBooksResponse = {
  kind: 'books#volumes',
  totalItems: 566,
  items: [
    {
      kind: 'books#volume',
      id: 'qTbDDwAAQBAJ',
      etag: 'XGGlyWcOk+w',
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
          'http://books.google.com.ar/books?id=qTbDDwAAQBAJ&printsec=frontcover&dq=1793&hl=&cd=1&source=gbs_api',
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
    },
    {
      kind: 'books#volume',
      id: 'YoiVzVeuXo4C',
      etag: 'EYwsUcnnCqc',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/YoiVzVeuXo4C',
      volumeInfo: {
        title: 'El Drama de 1793',
        subtitle: 'escenas revolucionarias',
        authors: ['Alexandre Dumas'],
        publishedDate: '1856',
        industryIdentifiers: [
          {
            type: 'OTHER',
            identifier: 'BNC:1001061599',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 568,
        printType: 'BOOK',
        categories: ['França'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.4.7.0.full.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=YoiVzVeuXo4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=YoiVzVeuXo4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=YoiVzVeuXo4C&pg=PA67&dq=1793&hl=&cd=2&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=YoiVzVeuXo4C&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=YoiVzVeuXo4C',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FREE',
        isEbook: true,
        buyLink:
          'https://play.google.com/store/books/details?id=YoiVzVeuXo4C&rdid=book-YoiVzVeuXo4C&rdot=1&source=gbs_api',
      },
      accessInfo: {
        country: 'AR',
        viewability: 'ALL_PAGES',
        embeddable: true,
        publicDomain: true,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
          downloadLink:
            'http://books.google.com.ar/books/download/El_Drama_de_1793.epub?id=YoiVzVeuXo4C&hl=&output=epub&source=gbs_api',
        },
        pdf: {
          isAvailable: true,
          downloadLink:
            'http://books.google.com.ar/books/download/El_Drama_de_1793.pdf?id=YoiVzVeuXo4C&hl=&output=pdf&sig=ACfU3U1E-DVB6c1vWSE1Z38hOLROe3KtRg&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=YoiVzVeuXo4C&hl=&source=gbs_api',
        accessViewStatus: 'FULL_PUBLIC_DOMAIN',
        quoteSharingAllowed: false,
      },
    },
    {
      kind: 'books#volume',
      id: 'BuYmdQs8Z6UC',
      etag: 'U38oV/5jAhk',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/BuYmdQs8Z6UC',
      volumeInfo: {
        title: 'Almanak y calendario general para el año de 1793',
        authors: ['Judas Tadeo Ortiz Gallardo y Villarroel'],
        publishedDate: '1792*',
        industryIdentifiers: [
          {
            type: 'OTHER',
            identifier: 'BNC:1001905011',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 22,
        printType: 'BOOK',
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.6.7.0.full.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=BuYmdQs8Z6UC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=BuYmdQs8Z6UC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=BuYmdQs8Z6UC&pg=PP1&dq=1793&hl=&cd=3&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=BuYmdQs8Z6UC&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=BuYmdQs8Z6UC',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FREE',
        isEbook: true,
        buyLink:
          'https://play.google.com/store/books/details?id=BuYmdQs8Z6UC&rdid=book-BuYmdQs8Z6UC&rdot=1&source=gbs_api',
      },
      accessInfo: {
        country: 'AR',
        viewability: 'ALL_PAGES',
        embeddable: true,
        publicDomain: true,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
          downloadLink:
            'http://books.google.com.ar/books/download/Almanak_y_calendario_general_para_el_a%C3%B1.epub?id=BuYmdQs8Z6UC&hl=&output=epub&source=gbs_api',
        },
        pdf: {
          isAvailable: true,
          downloadLink:
            'http://books.google.com.ar/books/download/Almanak_y_calendario_general_para_el_a%C3%B1.pdf?id=BuYmdQs8Z6UC&hl=&output=pdf&sig=ACfU3U3_c665XDYdyZ_8gK5fRGICyWnZ9A&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=BuYmdQs8Z6UC&hl=&source=gbs_api',
        accessViewStatus: 'FULL_PUBLIC_DOMAIN',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... . Con licencia y orden del Consejo . Barcelona : Por FRANCISCO SURIA Y BURGADA , IMPRESOR de Su Mag . , calle de la Paja . Era Christiana <b>1793</b>. Creacion del Mundo 6992. Diluvio Univer- sal. CB 1001905011 ALMANAK , Front Cover.',
      },
    },
    {
      kind: 'books#volume',
      id: 'PeX6EAAAQBAJ',
      etag: 'Dd74AJWingg',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/PeX6EAAAQBAJ',
      volumeInfo: {
        title: 'La Guerra de la Convención en Guipúzcoa (1793-1795)',
        subtitle:
          'Acciones legales contra militares y civiles a consecuencia de la guerra y reconocimiento francés de los excesos cometidos',
        authors: ['Justo Martín Gómez'],
        publisher: 'EDITORIAL SANZ Y TORRES S.L.',
        publishedDate: '2024-03-13',
        description:
          'España y Francia firmaron el Tratado de Paz de Basilea el 22 de julio de 1795 mediante el cual se puso fin a la Guerra de la Convención. España lo hizo en una posición de debilidad y de forma muy precipitada, para evitar daños mayores ante el rápido avance francés, quedando subyugada a la voluntad francesa. El desastre de la guerra en Guipúzcoa debía tener consecuencias y las tuvo para ciertos oficiales del ejército y de las Compañías de naturales, así como para alcaldes, capitulares y vecinos de San Sebastián y Fuenterrabía y, naturalmente, también contra algunos infidentes de la Provincia, aunque de una u otra forma estos últimos salieron bien parados. Se iniciaron dos Consejos de Guerra, uno en Pamplona por la entrega de las ciudades y Plazas de Fuenterrabía y San Sebastián, del que se emitieron hasta 7 Sentencias, y otro en Burgos contra el jefe del ejército en Guipúzcoa. Se iniciaron, asimismo, acciones judiciales contra los colaboracionistas de Tolosa ante el Juez Ordinario, terminando el proceso en la Real Chancillería de Valladolid en su final, tutelado por los franceses. La Provincia pretendió accionar contra los infidentes de la misma, pero no obtuvo el plácet real. Los franceses también iniciaron acciones contra sus compatriotas por los excesos que cometieron en Guipúzcoa y en Vizcaya, pero se suspendieron con la firma de la paz.',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9788419947345',
          },
          {
            type: 'ISBN_10',
            identifier: '8419947342',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 253,
        printType: 'BOOK',
        categories: ['History'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.0.1.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=PeX6EAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=PeX6EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=PeX6EAAAQBAJ&pg=PA9&dq=1793&hl=&cd=4&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=PeX6EAAAQBAJ&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=PeX6EAAAQBAJ',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: {
          amount: 10.8,
          currencyCode: 'USD',
        },
        retailPrice: {
          amount: 10.8,
          currencyCode: 'USD',
        },
        buyLink:
          'https://play.google.com/store/books/details?id=PeX6EAAAQBAJ&rdid=book-PeX6EAAAQBAJ&rdot=1&source=gbs_api',
        offers: [
          {
            finskyOfferType: 1,
            listPrice: {
              amountInMicros: 10800000,
              currencyCode: 'USD',
            },
            retailPrice: {
              amountInMicros: 10800000,
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
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=PeX6EAAAQBAJ&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>1793</b> y 1795 no fue una excepción . La Francia convencional se enfrentó a lo largo de toda su frontera con los distintos Estados y Reinos europeos , po- niendo en pie de guerra a la mayor parte de sus hijos , a aquellos que , por&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'v9aAEAAAQBAJ',
      etag: 'ePs3PZ9NJF8',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/v9aAEAAAQBAJ',
      volumeInfo: {
        title: 'La guerra de la convención en Guipúzcoa (1793-1795)',
        subtitle:
          'Funcionamiento institucional y particularismo foral en el contexto de un conflicto internacional',
        authors: ['Justo Martín Gómez'],
        publisher: 'EDITORIAL SANZ Y TORRES S.L.',
        description:
          'La Guerra de la Convención generada por la Francia revolucionaria en toda Europa llegó también a España y afectó principalmente a ambos extremos de los Pirineos. Gipuzkoa levantó su gente, según su fuero y se preparó para la guerra desde 1792, pero sus milicias y sus medios no eran adecuados para una guerra de fin del siglo XVIII. Por su parte el ejército español estaba bien dotado a comienzos de 1793 pero fue superado en 1794 y 95 por un ejército francés con más medios humanos y materiales. Algunos guipuzcoanos, como fue el caso del Diputado General Don José Fernando de Echave y Asu y Romero y la Diputación que controlaba, apoyaron a los convencionales esperando convertir a la Provincia en una República independiente bajo tutela francesa, o anexionarla a la Francia revolucionaria. No obstante, la mayoría de la Provincia, con sus Juntas provinciales, se mantuvo fiel al Rey y logró resistir prácticamente hasta la firma de la Paz de Basilea de 1795. La sentencia del Consejo de Guerra y el perdón a los colaboracionistas civiles que siguieron a la contienda fueron, cuando menos, contradictorios e inexplicables.',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9788418316876',
          },
          {
            type: 'ISBN_10',
            identifier: '841831687X',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 558,
        printType: 'BOOK',
        categories: ['Architecture'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: 'preview-1.0.0',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=v9aAEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=v9aAEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=v9aAEAAAQBAJ&pg=PA167&dq=1793&hl=&cd=5&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=v9aAEAAAQBAJ&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=v9aAEAAAQBAJ',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: {
          amount: 10.8,
          currencyCode: 'USD',
        },
        retailPrice: {
          amount: 10.8,
          currencyCode: 'USD',
        },
        buyLink:
          'https://play.google.com/store/books/details?id=v9aAEAAAQBAJ&rdid=book-v9aAEAAAQBAJ&rdot=1&source=gbs_api',
        offers: [
          {
            finskyOfferType: 1,
            listPrice: {
              amountInMicros: 10800000,
              currencyCode: 'USD',
            },
            retailPrice: {
              amountInMicros: 10800000,
              currencyCode: 'USD',
            },
          },
        ],
      },
      accessInfo: {
        country: 'AR',
        viewability: 'ALL_PAGES',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.com.ar/books/download/La_guerra_de_la_convenci%C3%B3n_en_Guip%C3%BAzco-sample-pdf.acsm?id=v9aAEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=v9aAEAAAQBAJ&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>1793</b>) la Diputación de San Sebastián quiso asumir los poderes otorgados por la Junta. La Diputación de Azcoitia ... <b>1793</b> la Diputación Ordinaria representó 167 LA GUERRA DE LA CONVENCIÓN EN GUIPÚZCOA (<b>1793</b>-1795)',
      },
    },
    {
      kind: 'books#volume',
      id: 'p0_sEAAAQBAJ',
      etag: 'tRCHsPSwE1E',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/p0_sEAAAQBAJ',
      volumeInfo: {
        title:
          'En defensa del cuerpo. Dispositivos de control escolares en Cuba 1793-1958',
        authors: ['Yoel Cordoví Núñez'],
        publisher: 'RUTH',
        publishedDate: '2024-01-15',
        description:
          'Esta obra es un invaluable aporte a los estudios sobre la escuela y la sociedad en la Cuba de los siglos XIX y XX, así como a la historia de la práctica pedagógica y del pensamiento especializado en estos menesteres. Es fruto de una extensa labor iniciada hace ya algunos años, donde se han puesto en evidencia cuestiones tales como las proyecciones nacionalistas del profesorado cubano, el patriotismo en la escuela o el justo reconocimiento del papel desempeñado por los maestros humildes, tanto urbanos como rurales. Se ponen en relieve en este libro aristas desconocidas de la historia cubana y es capaz de suscitar más de un debate.',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9789590624520',
          },
          {
            type: 'ISBN_10',
            identifier: '9590624529',
          },
        ],
        readingModes: {
          text: true,
          image: true,
        },
        pageCount: 296,
        printType: 'BOOK',
        categories: ['Education'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.1.1.0.preview.3',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=p0_sEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=p0_sEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=p0_sEAAAQBAJ&pg=PT33&dq=1793&hl=&cd=6&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=p0_sEAAAQBAJ&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=p0_sEAAAQBAJ',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: {
          amount: 5.99,
          currencyCode: 'USD',
        },
        retailPrice: {
          amount: 5.99,
          currencyCode: 'USD',
        },
        buyLink:
          'https://play.google.com/store/books/details?id=p0_sEAAAQBAJ&rdid=book-p0_sEAAAQBAJ&rdot=1&source=gbs_api',
        offers: [
          {
            finskyOfferType: 1,
            listPrice: {
              amountInMicros: 5990000,
              currencyCode: 'USD',
            },
            retailPrice: {
              amountInMicros: 5990000,
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
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.com.ar/books/download/En_defensa_del_cuerpo_Dispositivos_de_co-sample-epub.acsm?id=p0_sEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.com.ar/books/download/En_defensa_del_cuerpo_Dispositivos_de_co-sample-pdf.acsm?id=p0_sEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=p0_sEAAAQBAJ&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>1793</b>, en Memorias de la Sociedad Económica de Amigos del País, Imp. de la Capitanía General, La Habana, <b>1793</b>, p. 173. 25 Fernando Ortiz: “La hija cubana del iluminismo”, en Revista Bimestre Cubana, vol. LI, no. 1, enero-febrero, 1943&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'hniHEAAAQBAJ',
      etag: 'YxRAwnctr+w',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/hniHEAAAQBAJ',
      volumeInfo: {
        title:
          'Trilogía de Estocolmo (edición pack con los títulos: 1793 | 1794 | 1795)',
        authors: ['Niklas Natt och Dag'],
        publisher: 'SALAMANDRA',
        publishedDate: '2022-10-06',
        description:
          'La serie que ha revolucionado los cánones del thriller histórico y triunfa en toda Europa. Un año después de la muerte del rey Gustavo III, el reino de Suecia se ha convertido en un nido de conspiraciones, suspicacias y recelos. En esta atmósfera irrespirable, Mickel Cardell, un veterano de la guerra contra Rusia, se ve inmerso en un mundo de truhanes y ladrones, mercenarios y meretrices, conspiraciones y crímenes despiadados. En compañía del sagaz abogado Cecil Winge primero, y, tras la muerte de éste, de su hermano Emil, Cardell se enfrentará al mal y la corrupción que campan a sus anchas en la sociedad sueca. Acompañada de imágenes hipnóticas y vívidas descripciones, esta formidable trilogía es una sangrienta historia de detectives relatada con gran pericia y también un recorrido trepidante por la decadencia del reino de Suecia durante la Revolución francesa. La crítica ha dicho... «El fenómeno de la novela negra antes del fin del mundo.» Carlos Zanón «Dicen de él que es el nuevo Stieg Larsson. Ahora su nombre te resultará impronunciable, pero te lo aprenderás seguro.» Patricia Villalobos «Paisajes grises o helados. Historias que estremecen. Preciosa ambientación y tramas de alta intensidad.» Lilian Neuman «Una cima literaria.» Jyllands-Posten «Un narrador brillante. [...] Niklas Natt och Dag ha creado una trilogía única, una poderosa recreación de la historia y una saga policíaca increíblemente apasionante y sangrienta.» Dagens Nyheter',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9788419346452',
          },
          {
            type: 'ISBN_10',
            identifier: '8419346454',
          },
        ],
        readingModes: {
          text: true,
          image: true,
        },
        pageCount: 1393,
        printType: 'BOOK',
        categories: ['Fiction'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '1.6.5.0.preview.3',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=hniHEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=hniHEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=hniHEAAAQBAJ&pg=PT385&dq=1793&hl=&cd=7&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=hniHEAAAQBAJ&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=hniHEAAAQBAJ',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: {
          amount: 28.99,
          currencyCode: 'USD',
        },
        retailPrice: {
          amount: 28.99,
          currencyCode: 'USD',
        },
        buyLink:
          'https://play.google.com/store/books/details?id=hniHEAAAQBAJ&rdid=book-hniHEAAAQBAJ&rdot=1&source=gbs_api',
        offers: [
          {
            finskyOfferType: 1,
            listPrice: {
              amountInMicros: 28990000,
              currencyCode: 'USD',
            },
            retailPrice: {
              amountInMicros: 28990000,
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
            'http://books.google.com.ar/books/download/Trilog%C3%ADa_de_Estocolmo_edici%C3%B3n_pack_con-sample-epub.acsm?id=hniHEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.com.ar/books/download/Trilog%C3%ADa_de_Estocolmo_edici%C3%B3n_pack_con-sample-pdf.acsm?id=hniHEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=hniHEAAAQBAJ&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          'Niklas Natt och Dag. Título original: <b>1793</b> Edición en formato digital: enero de 2020 Copyright © Niklas Natt och Dag, 2017 Publicado por acuerdo con Salomonsson Agency Copyright de la edición en castellano © Ediciones ... <b>1793</b> ...',
      },
    },
    {
      kind: 'books#volume',
      id: 'w3NpqenBE2YC',
      etag: 'zEi0Y6CyV6g',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/w3NpqenBE2YC',
      volumeInfo: {
        title: 'Constitutional Documents of Colombia and Panama 1793–1853',
        authors: ['Bernd Marquardt'],
        publisher: 'Walter de Gruyter',
        publishedDate: '2009-12-15',
        description:
          'Between 1793 and 1853 Columbia underwent a transition from being the Spanish viceroyalty New Granada to the Gran Columbia of liberator president Simón Bolívar, and on to become one of the most liberal republics in the contemporary world. The Constitutional Documents of Colombia and Panama 1793–1853 presents the first declaration of human rights in Spanish from the year 1793, along with the first constitutional charter of Ibero-America (that of the Free State of Socorro from 1810), as well as the previously little-known early constitutions of the Antioquia Republic from 1811. The volume contains 32 national documents and 21 state document of Colombia and two documents of Panama.',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9783598441509',
          },
          {
            type: 'ISBN_10',
            identifier: '3598441509',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 723,
        printType: 'BOOK',
        categories: ['History'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.1.1.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=w3NpqenBE2YC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=w3NpqenBE2YC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=w3NpqenBE2YC&pg=PA27&dq=1793&hl=&cd=8&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=w3NpqenBE2YC&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=w3NpqenBE2YC',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: {
          amount: 550,
          currencyCode: 'USD',
        },
        retailPrice: {
          amount: 550,
          currencyCode: 'USD',
        },
        buyLink:
          'https://play.google.com/store/books/details?id=w3NpqenBE2YC&rdid=book-w3NpqenBE2YC&rdot=1&source=gbs_api',
        offers: [
          {
            finskyOfferType: 1,
            listPrice: {
              amountInMicros: 550000000,
              currencyCode: 'USD',
            },
            retailPrice: {
              amountInMicros: 550000000,
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
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.com.ar/books/download/Constitutional_Documents_of_Colombia_and-sample-pdf.acsm?id=w3NpqenBE2YC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=w3NpqenBE2YC&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          'Bernd Marquardt. Derechos. del. Hombre. (<b>1793</b>). Derechos. del. Hombre1. Acta de la Confederación de las Provincias Unidas de la. La Asamblea Nacional reconoce y de- clara en presencia y baxo los auspicios del Ser Supremo, los derechos&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: '4i0G9spY5m4C',
      etag: 'X2bAAgg2WU8',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/4i0G9spY5m4C',
      volumeInfo: {
        title:
          'Descripción del Arzobispado de México de 1793 y El informe reservado del arzobispo de México de 1797',
        authors: [
          'Catholic Church. Archdiocese of Mexico City (Mexico). Archbishop (1772-1800 : Núñez de Haro y Peralta)',
          'Margarita Menegus Bornemann',
        ],
        publisher: 'UNAM',
        publishedDate: '2005',
        industryIdentifiers: [
          {
            type: 'ISBN_10',
            identifier: '9703227260',
          },
          {
            type: 'ISBN_13',
            identifier: '9789703227266',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 100,
        printType: 'BOOK',
        categories: ['Mexico'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.3.5.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=4i0G9spY5m4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=4i0G9spY5m4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=4i0G9spY5m4C&pg=PA15&dq=1793&hl=&cd=9&source=gbs_api',
        infoLink:
          'http://books.google.com.ar/books?id=4i0G9spY5m4C&dq=1793&hl=&source=gbs_api',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Descripci%C3%B3n_del_Arzobispado_de_M%C3%A9xico.html?hl=&id=4i0G9spY5m4C',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'AR',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.com.ar/books/download/Descripci%C3%B3n_del_Arzobispado_de_M%C3%A9xico-sample-pdf.acsm?id=4i0G9spY5m4C&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=4i0G9spY5m4C&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>1793</b> // f 1 Arzobispado de México // La Santa Yglesia Metropolitana de México se erigió en silla episcopal con título o advocación de la Asumpción de Nuestra Señora por bula del señor Clemente 7o , de 2 de septiembre de 1530. El Sumo&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'MoN5MUQwLNUC',
      etag: 'D0E0Bl/YpRM',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/MoN5MUQwLNUC',
      volumeInfo: {
        title:
          'Poblacion de N[ueva] E[spaña] ... Censo general hecho en 1793, etc. [Translated from Chap. IV. of the “Essai politique sur le royaume de la Nouvelle Espagne.”]',
        authors: ['Alexander von Humboldt'],
        publishedDate: '1820',
        industryIdentifiers: [
          {
            type: 'OTHER',
            identifier: 'BL:A0027072768',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 16,
        printType: 'BOOK',
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.1.2.0.full.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=MoN5MUQwLNUC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=MoN5MUQwLNUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'es',
        previewLink:
          'http://books.google.com.ar/books?id=MoN5MUQwLNUC&pg=PA7&dq=1793&hl=&cd=10&source=gbs_api',
        infoLink:
          'https://play.google.com/store/books/details?id=MoN5MUQwLNUC&source=gbs_api',
        canonicalVolumeLink:
          'https://play.google.com/store/books/details?id=MoN5MUQwLNUC',
      },
      saleInfo: {
        country: 'AR',
        saleability: 'FREE',
        isEbook: true,
        buyLink:
          'https://play.google.com/store/books/details?id=MoN5MUQwLNUC&rdid=book-MoN5MUQwLNUC&rdot=1&source=gbs_api',
      },
      accessInfo: {
        country: 'AR',
        viewability: 'ALL_PAGES',
        embeddable: true,
        publicDomain: true,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
          downloadLink:
            'http://books.google.com.ar/books/download/Poblacion_de_N_ueva_E_spa%C3%B1a_Censo_gener.epub?id=MoN5MUQwLNUC&hl=&output=epub&source=gbs_api',
        },
        pdf: {
          isAvailable: false,
        },
        webReaderLink:
          'http://play.google.com/books/reader?id=MoN5MUQwLNUC&hl=&source=gbs_api',
        accessViewStatus: 'FULL_PUBLIC_DOMAIN',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>1793</b> juzgaban desde entonces que el núme ro de habitantes que se habian substraido al censo general , no podia compensarse con aquellos que erran tes , sin domicilio fijo habian sido contados muchas ve ces . Se supuso que se debia&nbsp;...',
      },
    },
  ],
};

export async function getBooks(query: string): Promise<GoogleBooksResponse> {
  //const request = await fetch(`${BASE_GOOGLE_API_URL}/volumes?q=${query}`);
  //const booksResponse = await request.json();
  //return booksResponse;
  console.log(query);
  return MOCK_RERSPONSE;
}
