import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UserBookStats from '@/app/(no-auth)/book/[slug]/components/user-book-stats';
import { Book, BookStatus } from '@/types/Book';

const electronicBook: Book = {
  id: 1,
  google_id: 'book-1',
  title: 'Example book',
  thumbnail_url: '',
  authors: '',
  publish_date: '',
  page_count: 200,
  inserted_at: '',
  start_date: '2026-01-08 12:00:00',
  finish_date: '2026-01-15 12:00:00',
  tags: '',
  user_email: 'reader@example.com',
  id_book_status: BookStatus.READ,
  book_type_id: 1,
  book_total_read_pages: 150,
  book_total_read_time: 4500,
};

describe('UserBookStats', () => {
  it('shows 100% progress and the recorded pages, time and dates for a finished electronic book', () => {
    render(<UserBookStats userBookData={{ success: true, data: electronicBook }} />);

    expect(screen.getByRole('region', { name: 'Reading summary' })).toBeInTheDocument();
    expect(screen.getByText('150 / 200 pages read')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Reading progress' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    expect(screen.getByText('1h 15m')).toBeInTheDocument();
    expect(screen.getByText('08/01/2026')).toBeInTheDocument();
    expect(screen.getByText('15/01/2026')).toBeInTheDocument();
  });

  it('shows 100% for a finished book without page counts', () => {
    const book = { ...electronicBook, page_count: 0, book_total_read_pages: null };
    render(<UserBookStats userBookData={{ success: true, data: book }} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it.each([
    { pagesRead: 0, percentage: 0 },
    { pagesRead: 150, percentage: 75 },
  ])('shows $percentage% for an ongoing book with $pagesRead pages read', ({ pagesRead, percentage }) => {
    const book = {
      ...electronicBook,
      id_book_status: BookStatus.READING,
      book_total_read_pages: pagesRead,
    };
    render(<UserBookStats userBookData={{ success: true, data: book }} />);

    expect(screen.getByText(`${pagesRead} / 200 pages read`)).toBeInTheDocument();
    expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.queryByText('15/01/2026')).not.toBeInTheDocument();
  });

  it('omits the percentage when the total page count is unavailable', () => {
    const book = {
      ...electronicBook,
      id_book_status: BookStatus.READING,
      page_count: 0,
      start_date: null,
    };
    render(<UserBookStats userBookData={{ success: true, data: book }} />);

    expect(screen.getByText('150 / — pages read')).toBeInTheDocument();
    expect(screen.getByText('Not recorded')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it.each([
    ['physical', { ...electronicBook, book_type_id: 2 }],
    ['on the reading list', { ...electronicBook, id_book_status: BookStatus.WANT_TO_READ }],
    ['outside the library', null],
  ])('hides the summary for a book %s', (_label, book) => {
    render(<UserBookStats userBookData={{ success: true, data: book }} />);

    expect(screen.queryByRole('region', { name: 'Reading summary' })).not.toBeInTheDocument();
  });
});
