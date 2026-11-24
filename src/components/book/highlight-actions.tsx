"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { NotebookPen, Quote, Trash } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { deleteBookHighlight, updateBookHighlightType } from "@/services/BookHighlightService"
import type { BookHighlightPreview } from "@/types/BookHighlight"

export default function HighlightActions({ highlight }: { highlight: BookHighlightPreview }) {
  const [isPending, startTransition] = useTransition()
  const { refresh } = useRouter()
  const category = highlight.is_note ? "note" : "quote"
  const moveLabel = highlight.is_note ? "Move to quotes" : "Move to notes"
  const MoveIcon = highlight.is_note ? Quote : NotebookPen

  function mutate(action: "delete" | "move") {
    startTransition(async () => {
      try {
        const result = action === "delete"
          ? await deleteBookHighlight(highlight.highlight_id)
          : await updateBookHighlightType(highlight.highlight_id, !highlight.is_note)
        if (!result.success) {
          toast.error(result.error || "Failed to update highlight")
          return
        }
        toast.success(action === "delete" ? "Highlight deleted" : highlight.is_note ? "Moved to quotes" : "Moved to notes")
        refresh()
      } catch {
        toast.error("Failed to update highlight")
      }
    })
  }

  return (
    <div className="flex shrink-0 items-center gap-1" aria-busy={isPending}>
      <Button type="button" variant="ghost" size="icon" disabled={isPending} onClick={() => mutate("move")}
        aria-label={`${moveLabel}: ${highlight.highlight_text}`} title={moveLabel}>
        {isPending ? <Spinner /> : <MoveIcon />}
      </Button>
      <Button type="button" variant="ghost" size="icon" disabled={isPending} onClick={() => mutate("delete")}
        aria-label={`Delete ${category} from ${highlight.title}`} title={`Delete ${category}`}>
        <Trash />
      </Button>
    </div>
  )
}
