import { getAllHighlights } from "@/services/BookHighlightService"
import HighlightsList from "./components/highlights-list"
import AddHighlight from "./components/add-highlight"
import { highlightsPageClassName } from "./components/highlights-layout"

async function HighlightsPage() {
  const result = await getAllHighlights()
  const highlights = result.data || []

  return (
    <main className={highlightsPageClassName}>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-baseline gap-2'>
          <h1 className='text-2xl/8 font-normal min-[600px]:text-[28px]/9'>
            My Highlights
          </h1>
          {highlights.length > 0 && (
            <span className='text-sm text-muted-foreground'>({highlights.length})</span>
          )}
        </div>
        <AddHighlight />
      </header>
      <HighlightsList highlights={highlights} />
    </main>
  )
}

export default HighlightsPage
