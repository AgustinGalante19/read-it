import { Book } from './Book';

export interface TagRadarData {
  tag: string;
  count: number;
}

export default interface Stats {
  tag: { tagCount: number; lastTagReaded: string; radarData: TagRadarData[] };
  book: {
    totalBooks: Book[];
    count: number;
    lastRead: { title: string; googleId: string };
  };
  page: { totalPageCount: number; lastMonthCount: number };
  last6MonthsReadedBooks: Book[];
}
