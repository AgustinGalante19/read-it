"use client"

import type { ReactNode } from "react"
import { NotebookPen, Quote } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HighlightTabs({
  quoteCount, noteCount, quotes, notes,
}: {
  quoteCount: number
  noteCount: number
  quotes: ReactNode
  notes: ReactNode
}) {
  return (
    <Tabs defaultValue="quotes">
      <TabsList aria-label="Highlight categories">
        <TabsTrigger value="quotes"><Quote />Quotes ({quoteCount})</TabsTrigger>
        <TabsTrigger value="notes"><NotebookPen />Notes ({noteCount})</TabsTrigger>
      </TabsList>
      <TabsContent value="quotes">{quotes}</TabsContent>
      <TabsContent value="notes">{notes}</TabsContent>
    </Tabs>
  )
}
