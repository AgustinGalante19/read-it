import { validateDeviceCode } from '@/lib/validateDevice';
import { addBookHighlight } from '@/services/BookHighlightService';

export async function POST(request: Request) {
  const body = await request.json();
  const { book_hash, created_at, device_code, highlight_text, page } = body;

  const isValid = validateDeviceCode(device_code);
  if (!isValid) {
    return Response.json(
      { success: false, error: 'Invalid device code' },
      { status: 400 },
    );
  }

  const result = await addBookHighlight({
    book_hash,
    created_at,
    device_code,
    highlight_text,
    id: 0,
    page,
  });

  return Response.json(result);
}
