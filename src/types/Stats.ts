import { Book } from './Book';

export default interface Stats {
  tag: { tagCount: number; lastTagReaded: string };
  book: {
    count: number;
    lastRead: { title: string; googleId: string };
  };
  page: { totalPageCount: number; lastMonthCount: number };
  last6MonthsReadedBooks: Book[];
}
