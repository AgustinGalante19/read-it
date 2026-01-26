export default interface BookHighlight {
  id: number;
  device_code: string;
  highlight_text: string;
  book_hash: string;
  page: number;
  created_at: Date;
}

export interface BookHighlightPreview {
  highlight_id: number;
  book_id: number;
  title: string;
  author: string;
  highlight_text: string;
  page: number;
  created_at: string;
}

export interface BookHighlightWithBook extends BookHighlightPreview {
  google_id: string;
  thumbnail_url: string | null;
}
