export default interface BookHighlight {
  id: number
  device_code: string | null
  highlight_text: string
  book_hash: string | null
  google_id: string
  user_email: string
  is_note: boolean
  page: number
  created_at: Date
}

export type BookHighlightInput = Omit<BookHighlight, "created_at"> & {
  created_at: Date | string
}

export type KoreaderBookHighlightInput = Omit<
  BookHighlightInput,
  "google_id" | "user_email" | "is_note" | "book_hash" | "device_code" | "page"
> & {
  book_hash: string
  device_code: string
  page: number | string
  isNote?: boolean
}

export interface BookHighlightPreview {
  highlight_id: number
  book_id: number
  title: string
  author: string
  highlight_text: string
  page: number
  created_at: string
  is_note: boolean
}

export interface BookHighlightWithBook extends BookHighlightPreview {
  google_id: string
  thumbnail_url: string | null
}
