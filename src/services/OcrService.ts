import { createWorker } from "tesseract.js"

function normalizeOcrText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function runRecognition(
  buffer: Buffer,
  language: string,
): Promise<string> {
  const worker = await createWorker(language)

  try {
    const {
      data: { text },
    } = await worker.recognize(buffer)

    return normalizeOcrText(text)
  } finally {
    await worker.terminate()
  }
}

export async function extractTextFromImageBuffer(
  buffer: Buffer,
): Promise<string> {
  try {
    return await runRecognition(buffer, "spa+eng")
  } catch {
    return await runRecognition(buffer, "eng")
  }
}
