import { extractTextFromImageBuffer } from "@/services/OcrService"
import { getUserEmail, isAuthenticated } from "@/services/UserService"

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const userEmail = await getUserEmail()
    const authValidation = await isAuthenticated(userEmail)
    if (authValidation?.error) {
      return Response.json(
        { success: false, error: authValidation.error },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get("image")

    if (!(imageFile instanceof File)) {
      return Response.json(
        { success: false, error: "Image file is required" },
        { status: 400 },
      )
    }

    if (!imageFile.type.startsWith("image/")) {
      return Response.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 },
      )
    }

    if (imageFile.size > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        { success: false, error: "Image is too large. Maximum size is 8MB" },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const text = await extractTextFromImageBuffer(buffer)

    if (!text) {
      return Response.json(
        {
          success: false,
          error: "No readable text was found. Try a clearer image.",
        },
        { status: 422 },
      )
    }

    return Response.json({ success: true, data: text })
  } catch (error) {
    console.error("OCR extraction failed:", error)
    return Response.json(
      { success: false, error: "Failed to process image OCR" },
      { status: 500 },
    )
  }
}
