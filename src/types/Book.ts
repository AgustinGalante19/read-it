export interface Book {
  id: number;
  google_id: string;
  title: string;
  thumbnail_url: string;
  authors: string;
  publish_date: string;
  page_count: number;
  inserted_at: string;
  start_date: string | null;
  finish_date: string | null;
  tags: string;
  user_email: string;
  id_book_status: number;
  book_hash?: string | null;
  book_last_open?: string | null;
  book_total_read_time?: number | null;
  book_total_read_pages?: number | null;
}

export interface BookPageStatData {
  id: number;
  hash: string;
  page: number;
  duration: number;
  start_time: string;
  total_pages: number;
}

export interface ExtendedBookData extends Book {
  description?: string;
}

export enum BookStatus {
  WANT_TO_READ = 1,
  READING = 2,
  READ = 3,
  NOT_FINISH = 4,
  ALL = 0,
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items: GoogleBookItem[];
}

export interface GoogleBookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
}

export interface VolumeInfo {
  title: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  categories?: string[];
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
  subtitle?: string;
}

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: ListPrice;
  retailPrice?: RetailPrice;
  buyLink?: string;
  offers?: Offer[];
}

export interface ListPrice {
  amount: number;
  currencyCode: string;
}

export interface RetailPrice {
  amount: number;
  currencyCode: string;
}

export interface Offer {
  finskyOfferType: number;
  listPrice: ListPrice2;
  retailPrice: RetailPrice2;
}

export interface ListPrice2 {
  amountInMicros: number;
  currencyCode: string;
}

export interface RetailPrice2 {
  amountInMicros: number;
  currencyCode: string;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: Epub;
  pdf: Pdf;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface Epub {
  isAvailable: boolean;
  acsTokenLink?: string;
  downloadLink?: string;
}

export interface Pdf {
  isAvailable: boolean;
  acsTokenLink?: string;
  downloadLink?: string;
}

export interface SearchInfo {
  textSnippet: string;
}
