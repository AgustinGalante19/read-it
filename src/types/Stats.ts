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
  activity: {
    week: { pages: number; duration: number };
    month: { pages: number; duration: number };
  };
  dailyActivity: { date: string; pages: number; duration: number }[];
  hourlyActivity: { hour: number; pages: number; duration: number }[];
}

export interface YearlyRecap {
  year: number;
  totalBooks: number;
  totalPages: number;
  books: Book[];
  topGenres: { tag: string; count: number }[];
  longestBook?: Book;
  shortestBook?: Book;
  mostActiveMonth: { month: string; count: number };
}
