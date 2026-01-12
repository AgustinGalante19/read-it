export default interface BookHighlight {
  id: number;
  device_code: string;
  highlight_text: string;
  book_hash: string;
  page: number;
  created_at: Date;
}

export interface BookHighlightPreview {
  id: number;
  title: string;
  author: string;
  highlight_text: string;
  page: number;
  created_at: string;
}
