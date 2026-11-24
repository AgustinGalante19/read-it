"use server"

import {
  KoreaderBookHighlightInput,
  BookHighlightPreview,
  BookHighlightWithBook,
} from "@/types/BookHighlight"
import { Result } from "@/types/Result"
import bookHighlightsRepository from "./repositories/BookHighlightsRepository"
import bookRepository from "./repositories/BookRepository"
import { revalidatePath } from "next/cache"
import { getUserEmail } from "./UserService"

function validHighlight(text: string, page: number): boolean {
  return typeof text === "string" && text.trim().length > 0 &&
    Number.isInteger(page) && page >= 0
}

function revalidateHighlights(googleId: string) {
  revalidatePath("/highlights")
  revalidatePath(`/book/${googleId}`)
}

export async function addBookHighlight(
  highlightData: KoreaderBookHighlightInput,
): Promise<Result<string> & { status?: number }> {
  try {
    const { isNote = false, ...highlight } = highlightData
    if (typeof isNote !== "boolean") {
      return { success: false, error: "isNote must be a boolean", status: 400 }
    }
    const page = typeof highlightData.page === "number"
      ? highlightData.page
      : typeof highlightData.page === "string" && highlightData.page.trim()
        ? Number(highlightData.page)
        : NaN
    if (!validHighlight(highlightData.highlight_text, page) ||
      typeof highlightData.book_hash !== "string" || !highlightData.book_hash.trim() ||
      typeof highlightData.device_code !== "string" || !highlightData.device_code.trim()) {
      return { success: false, error: "Invalid highlight data", status: 400 }
    }

    const book = await bookRepository.findBookByHashAndDevice(
      highlightData.book_hash,
      highlightData.device_code,
    )
    if (!book) {
      return { success: false, error: "Book not linked to this device", status: 404 }
    }

    await bookHighlightsRepository.createHighlight({
      ...highlight,
      page,
      google_id: book.google_id,
      user_email: book.user_email,
      is_note: isNote,
    })
    revalidateHighlights(book.google_id)
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
  isNote = false,
}: {
  googleId: string
  highlightText: string
  page: number
  isNote?: boolean
}): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail()
    if (!userEmail) return { success: false, error: "User not authenticated" }
    if (typeof googleId !== "string" || !googleId.trim() ||
      !validHighlight(highlightText, page) || typeof isNote !== "boolean") {
      return { success: false, error: "Invalid highlight data" }
    }

    const book = await bookRepository.findBookByGoogleId(googleId, userEmail)
    if (!book) {
      return { success: false, error: "Book not found" }
    }

    await bookHighlightsRepository.createHighlight({
      id: 0,
      device_code: null,
      highlight_text: highlightText.trim(),
      book_hash: null,
      google_id: googleId,
      user_email: userEmail,
      is_note: isNote,
      page,
      created_at: new Date(),
    })

    revalidateHighlights(googleId)

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
    if (!userEmail) return { success: false, error: "User not authenticated" }

    const highlight = await bookHighlightsRepository.getHighlightById(
      highlightId,
      userEmail,
    )
    if (!highlight) {
      return { success: false, error: "Highlight not found" }
    }

    await bookHighlightsRepository.deleteHighlight(highlightId, userEmail)
    revalidateHighlights(highlight.google_id)
    return { success: true, data: "Book highlight deleted successfully" }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete book highlight" }
  }
}

export async function updateBookHighlightType(
  highlightId: number,
  isNote: boolean,
): Promise<Result<string>> {
  try {
    const userEmail = await getUserEmail()
    if (!userEmail) return { success: false, error: "User not authenticated" }
    if (!Number.isInteger(highlightId) || typeof isNote !== "boolean") {
      return { success: false, error: "Invalid highlight data" }
    }

    const highlight = await bookHighlightsRepository.getHighlightById(highlightId, userEmail)
    if (!highlight) return { success: false, error: "Highlight not found" }

    await bookHighlightsRepository.updateHighlightType(highlightId, userEmail, isNote)
    revalidateHighlights(highlight.google_id)
    return { success: true, data: "Highlight category updated successfully" }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to update highlight category" }
  }
}

export async function getBookHighlights(
  googleId: string,
): Promise<Result<BookHighlightPreview[]>> {
  try {
    const userEmail = await getUserEmail()
    if (!userEmail) return { success: false, error: "User not authenticated" }

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
    if (!userEmail) return { success: false, error: "User not authenticated" }

    const highlights =
      await bookHighlightsRepository.getAllUserHighlights(userEmail)
    return { success: true, data: highlights }
  } catch (error) {
    console.error("Error getting all highlights:", error)
    return { success: false, error: "Failed to get highlights" }
  }
}
