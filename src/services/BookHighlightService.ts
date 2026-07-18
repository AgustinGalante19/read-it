"use server"

import BookHighlight, {
  BookHighlightPreview,
  BookHighlightWithBook,
} from "@/types/BookHighlight"
import { Result } from "@/types/Result"
import bookHighlightsRepository from "./repositories/BookHighlightsRepository"
import bookRepository from "./repositories/BookRepository"
import { revalidatePath } from "next/cache"
import { getUserEmail, isAuthenticated } from "./UserService"

export async function addBookHighlight(
  highlightData: BookHighlight,
): Promise<Result<string>> {
  try {
    await bookHighlightsRepository.createHighlight(highlightData)
    return { success: true, data: "Book highlight added successfully" }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to add book highlight" }
  }
}

export async function addManualBookHighlight({
  googleId,
  highlightText,
  page,
}: {
  googleId: string
  highlightText: string
  page: number
}): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail()
    await isAuthenticated(userEmail)

    const book = await bookRepository.findBookByGoogleId(googleId, userEmail)
    if (!book) {
      return { success: false, error: "Book not found" }
    }

    const bookHash =
      book.book_hash ?? `manual-${crypto.randomUUID().replace(/-/g, "")}`

    if (!book.book_hash) {
      await bookRepository.updateBookHashByGoogleId(
        googleId,
        userEmail,
        bookHash,
      )
    }

    await bookHighlightsRepository.createHighlight({
      id: 0,
      device_code: null,
      highlight_text: highlightText,
      book_hash: bookHash,
      page,
      created_at: new Date(),
    })

    revalidatePath("/highlights")
    revalidatePath(`/book/${googleId}`)

    return { success: true, data: "Book highlight added successfully" }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to add book highlight" }
  }
}

export async function deleteBookHighlight(
  highlightId: number,
): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail()
    await isAuthenticated(userEmail)

    const highlight = await bookHighlightsRepository.getHighlightById(
      highlightId,
      userEmail,
    )
    if (!highlight) {
      return { success: false, error: "Highlight not found" }
    }

    await bookHighlightsRepository.deleteHighlight(highlightId)
    revalidatePath("/book/[slug]")
    revalidatePath("/highlights")
    return { success: true, data: "Book highlight deleted successfully" }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete book highlight" }
  }
}

export async function getBookHighlights(
  googleId: string,
): Promise<Result<BookHighlightPreview[]>> {
  try {
    const userEmail = await getUserEmail()
    await isAuthenticated(userEmail)

    const highlights = await bookHighlightsRepository.getHighlights(
      googleId,
      userEmail,
    )
    return { success: true, data: highlights }
  } catch (error) {
    console.error("Error getting book highlights:", error)
    return { success: false, error: "Failed to get book highlights" }
  }
}

export async function getAllHighlights(): Promise<
  Result<BookHighlightWithBook[]>
> {
  try {
    const userEmail = await getUserEmail()
    await isAuthenticated(userEmail)

    const highlights =
      await bookHighlightsRepository.getAllUserHighlights(userEmail)
    return { success: true, data: highlights }
  } catch (error) {
    console.error("Error getting all highlights:", error)
    return { success: false, error: "Failed to get highlights" }
  }
}
