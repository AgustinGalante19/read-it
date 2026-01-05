export default interface BookHighlight {
  id: number;
  device_code: string;
  highlight_text: string;
  book_hash: string;
  page: number;
  created_at: Date;
}
