import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HighlightsList from '@/app/(home)/highlights/components/highlights-list';
import HighlightsModal from '@/components/book/highlights-modal';
import AddHighlight from '@/app/(home)/highlights/components/add-highlight';
import type { BookHighlightWithBook } from '@/types/BookHighlight';
import type { Book } from '@/types/Book';

const { refresh, success, error } = vi.hoisted(() => ({ refresh: vi.fn(), success: vi.fn(), error: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('sonner', () => ({ toast: { success, error } }));
vi.mock('@/services/BookHighlightService', () => ({
  deleteBookHighlight: vi.fn(), updateBookHighlightType: vi.fn(), addManualBookHighlight: vi.fn(),
}));
vi.mock('@/services/BookService', () => ({ getMyBooks: vi.fn() }));
import { deleteBookHighlight, updateBookHighlightType, addManualBookHighlight } from '@/services/BookHighlightService';
import { getMyBooks } from '@/services/BookService';

const quote: BookHighlightWithBook = {
  highlight_id: 7, book_id: 1, google_id: 'g1', title: 'Example book', author: 'An author',
  thumbnail_url: null, highlight_text: 'A memorable phrase', page: 12, created_at: '2026-11-24T10:00:00Z', is_note: false,
};
const note: BookHighlightWithBook = { ...quote, highlight_id: 8, is_note: true, highlight_text: 'Investigate Las meninas' };

describe('highlight categories and actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(updateBookHighlightType).mockResolvedValue({ success: true });
    vi.mocked(deleteBookHighlight).mockResolvedValue({ success: true });
    vi.mocked(addManualBookHighlight).mockResolvedValue({ success: true });
    vi.mocked(getMyBooks).mockResolvedValue({ success: true, data: [{ id: 1, google_id: 'g1', title: quote.title, authors: quote.author } as Book] });
  });

  it('separates quotes and notes, with counts and normal text for research notes', () => {
    render(<HighlightsList highlights={[quote, note]} />);
    expect(screen.getByRole('tab', { name: 'Quotes (1)' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/A memorable phrase/).tagName).toBe('BLOCKQUOTE');
    expect(screen.queryByText(note.highlight_text)).not.toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Notes (1)' }), { button: 0, ctrlKey: false });
    expect(screen.getByRole('tab', { name: 'Notes (1)' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(note.highlight_text).tagName).toBe('P');
    expect(screen.queryByText(/A memorable phrase/)).not.toBeInTheDocument();
  });

  it('shows an empty state specific to each category', () => {
    render(<HighlightsList highlights={[]} />);
    expect(screen.getByText('No quotes yet')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Notes (0)' }), { button: 0, ctrlKey: false });
    expect(screen.getByText('No notes yet')).toBeInTheDocument();
  });

  it('shows a single highlight in the book dialog and keeps notes in their own tab', () => {
    render(<HighlightsModal highlights={[quote, note]} book={{ title: quote.title, authors: quote.author } as Book}
      isOpen onOpenChange={() => {}} />);
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText(/A memorable phrase/)).toBeInTheDocument();
    expect(dialog.queryByText(note.highlight_text)).not.toBeInTheDocument();
    fireEvent.mouseDown(dialog.getByRole('tab', { name: 'Notes (1)' }), { button: 0, ctrlKey: false });
    expect(dialog.getByText(note.highlight_text).tagName).toBe('P');
  });

  it('reclassifies a quote and refreshes the displayed data', async () => {
    const { rerender } = render(<HighlightsList highlights={[quote]} />);
    fireEvent.click(screen.getByRole('button', { name: `Move to notes: ${quote.highlight_text}` }));
    await waitFor(() => expect(updateBookHighlightType).toHaveBeenCalledWith(7, true));
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    rerender(<HighlightsList highlights={[{ ...quote, is_note: true }]} />);
    expect(screen.getByRole('tab', { name: 'Notes (1)' })).toBeInTheDocument();
    expect(screen.getByText('No quotes yet')).toBeInTheDocument();
  });

  it('does not show success or refresh when deletion returns an error', async () => {
    vi.mocked(deleteBookHighlight).mockResolvedValue({ success: false, error: 'Highlight not found' });
    render(<HighlightsList highlights={[quote]} />);
    fireEvent.click(screen.getByRole('button', { name: `Delete quote from ${quote.title}` }));
    await waitFor(() => expect(error).toHaveBeenCalledWith('Highlight not found'));
    expect(success).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
    expect(screen.getByText(/A memorable phrase/)).toBeInTheDocument();
  });

  it('creates a research note from the manual form with its book and page', async () => {
    const user = userEvent.setup();
    render(<AddHighlight />);
    await user.click(screen.getByRole('button', { name: 'Add Highlight' }));
    const picker = await screen.findByRole('button', { name: 'Book Select a book' });
    await user.click(picker);
    const search = screen.getByRole('searchbox', { name: 'Search books by title or author' });
    expect(search).toHaveFocus();
    await user.type(search, quote.author);
    await user.tab();
    expect(screen.getByRole('button', { name: `${quote.title}, ${quote.author}` })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(picker).toHaveFocus();
    fireEvent.click(screen.getByRole('radio', { name: 'Note' }));
    fireEvent.change(screen.getByLabelText('Note'), { target: { value: 'Investigate Las meninas' } });
    fireEvent.change(screen.getByLabelText('Page'), { target: { value: '42' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }));
    await waitFor(() => expect(addManualBookHighlight).toHaveBeenCalledWith({
      googleId: 'g1', highlightText: 'Investigate Las meninas', page: 42, isNote: true,
    }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows field and save errors in the dialog and can retry a quote without a page', async () => {
    const user = userEvent.setup();
    vi.mocked(addManualBookHighlight).mockResolvedValueOnce({ success: false, error: 'Failed to save' });
    render(<AddHighlight />);
    await user.click(screen.getByRole('button', { name: 'Add Highlight' }));
    const picker = await screen.findByRole('button', { name: 'Book Select a book' });
    const save = screen.getByRole('button', { name: 'Save quote' });
    await user.click(save);
    expect(picker).toHaveAccessibleDescription('Choose a book.');
    expect(picker).toHaveFocus();
    await user.click(picker);
    await user.click(screen.getByRole('button', { name: `${quote.title}, ${quote.author}` }));
    await user.click(save);
    const editor = screen.getByRole('textbox', { name: 'Quote' });
    expect(editor).toHaveAccessibleDescription('Enter a quote.');
    expect(editor).toHaveFocus();
    await user.type(editor, quote.highlight_text);
    await user.click(save);
    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to save');
    expect(editor).toHaveValue(quote.highlight_text);

    await user.click(save);
    await waitFor(() => expect(addManualBookHighlight).toHaveBeenLastCalledWith({
      googleId: 'g1', highlightText: quote.highlight_text, page: 0, isNote: false,
    }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
