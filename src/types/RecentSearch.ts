import { Book } from './Book';

export interface RecentSearch extends Book {
  searchTimestamp: number;
}
