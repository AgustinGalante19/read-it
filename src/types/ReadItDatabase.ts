import type { ColumnType, Selectable } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Numbers {
  number: Generated<number | null>;
}

export interface PageStat {
  duration: string | null;
  hash: string | null;
  page: string | null;
  start_time: number | null;
}

export interface ReaditBooks {
  authors: string | null;
  book_hash: Generated<string | null>;
  book_last_open: Generated<string | null>;
  book_total_read_pages: Generated<number | null>;
  book_total_read_time: Generated<number | null>;
  book_type_id: number | null;
  finish_date: string | null;
  google_id: string;
  id: Generated<number | null>;
  id_book_status: number | null;
  inserted_at: Generated<string>;
  page_count: number | null;
  publish_date: string | null;
  start_date: string | null;
  tags: string | null;
  thumbnail_url: string | null;
  title: string;
  user_email: string | null;
}

export interface ReaditBooksHighlights {
  book_hash: string | null;
  created_at: string | null;
  device_code: string | null;
  highlight_text: string | null;
  id: Generated<number | null>;
  page: string | null;
}

export interface ReaditBookStatus {
  cd_status: string;
  ds_status: string;
  id: Generated<number | null>;
}

export interface ReaditBookType {
  code: string | null;
  id: Generated<number | null>;
  name: string | null;
}

export interface ReaditPageStatData {
  duration: number;
  hash: string;
  id: Generated<number | null>;
  page: number;
  start_time: number;
  total_pages: number;
  user_device_code: string | null;
}

export interface ReaditUserDevices {
  created_at: Generated<string>;
  device_code: string;
  device_name: string | null;
  id: Generated<number | null>;
  user_email: string;
}

export interface ReaditUsers {
  email: string;
  name: string | null;
}

// Better-auth tables
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadItDB {
  numbers: Numbers;
  page_stat: PageStat;
  readit_book_status: ReaditBookStatus;
  readit_book_type: ReaditBookType;
  readit_books: ReaditBooks;
  readit_books_highlights: ReaditBooksHighlights;
  readit_page_stat_data: ReaditPageStatData;
  readit_user_devices: ReaditUserDevices;
  readit_users: ReaditUsers;
  user: User;
  session: Session;
  account: Account;
  verification: Verification;
}

export type BookRow = Selectable<ReaditBooks>;
export type BookHighlightRow = Selectable<{
  authors: string | null;
  title: string | null;
  created_at: string | null;
  highlight_text: string | null;
  page: string | null;
  book_id: number | null;
  highlight_id: number | null;
}>;
