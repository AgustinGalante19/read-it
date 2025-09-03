import { VolumeInfo } from '@/types/Book';
import datesHelper from '../helpers/DatesHelper';
import bookHelper from '../helpers/BookHelper';

export default function GoogleVolumeAdapter(volumeInfo: VolumeInfo): {
  googleId: string;
  title: string;
  thumbnailUrl: string;
  authors: string;
  publishDate: string;
  pageCount: number;
  tags: string;
  userEmail: string;
} {
  const { title, authors, publishedDate, imageLinks, pageCount, categories } =
    volumeInfo;

  return {
    title,
    authors: bookHelper.getBookAuthors(authors),
    publishDate: datesHelper.getDateString(publishedDate),
    thumbnailUrl: imageLinks?.thumbnail || '/thumbnail-fallback.jpg',
    pageCount: pageCount || 0,
    tags: categories?.join(', ') || '',
    googleId: '',
    userEmail: '',
  };
}
