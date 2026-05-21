import "server-only"
import { GoogleBookItem, GoogleBooksResponse } from "@/types/Book"

const BASE_GOOGLE_API_URL = "https://www.googleapis.com/books/v1"

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY

class GoogleBooksService {
  async getBooksByQuery(query: string): Promise<GoogleBooksResponse> {
    const request = await fetch(
      `${BASE_GOOGLE_API_URL}/volumes?q=${encodeURIComponent(query)}&printType=books&key=${API_KEY}`,
      { cache: "force-cache" },
    )

    const booksResponse = await request.json()
    return booksResponse
  }

  async getBookById(id: string): Promise<GoogleBookItem> {
    console.log(API_KEY)
    const request = await fetch(
      `${BASE_GOOGLE_API_URL}/volumes/${id}?key=${API_KEY}`,
      {
        next: { revalidate: 60 * 60 * 48 },
      },
    )

    const booksResponse = await request.json()
    return booksResponse
  }

  async getBooksBySubject(subject: string): Promise<GoogleBooksResponse> {
    const bookResponse = await this.getBooksByQuery(
      `subject:${subject}&orderBy=relevance`,
    )

    return bookResponse
  }
}

const googleBooksService = new GoogleBooksService()

export default googleBooksService
