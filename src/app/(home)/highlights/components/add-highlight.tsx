"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { addManualBookHighlight } from "@/services/BookHighlightService"
import { getMyBooks } from "@/services/BookService"
import { Book, BookStatus } from "@/types/Book"

const placeholders = [
  "“Equivocamos esa paz con la muerte y creemos anhelar nuestro fin y anhelamos el sueño y la indiferencia”",
  "“Las cosas que lo rodeaban, la tierra, el río, los árboles, parecían tener alma suficiente para dialogar sin intermediarios con su necesidad de infinito.”",
  "“La oscuridad era algo vivo que la asfixió con sus lóbregos besos.”",
]

function AddHighlight() {
  const { refresh } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isSaving, startSaving] = useTransition()
  const [isBooksLoading, startLoadingBooks] = useTransition()

  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookGoogleId, setSelectedBookGoogleId] = useState("")
  const [bookQuery, setBookQuery] = useState("")
  const [highlight, setHighlight] = useState("")
  const [page, setPage] = useState("0")

  useEffect(() => {
    startLoadingBooks(async () => {
      const response = await getMyBooks(BookStatus.READING)
      if (!response.success || !response.data) {
        toast.error(response.error || "Failed to load books")
        return
      }

      setBooks(response.data)
    })
  }, [])

  const filteredBooks = useMemo(() => {
    if (!bookQuery) return books
    return books.filter((book) =>
      `${book.title} ${book.authors}`
        .toLowerCase()
        .includes(bookQuery.toLowerCase()),
    )
  }, [books, bookQuery])

  const selectedBook = books.find(
    (book) => book.google_id === selectedBookGoogleId,
  )

  const resetForm = () => {
    setSelectedBookGoogleId("")
    setBookQuery("")
    setHighlight("")
    setPage("0")
    setIsPickerOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedBook?.google_id) {
      toast.error("Select a currently reading book")
      return
    }
    const selectedGoogleId = selectedBook.google_id

    const highlightText = highlight.trim()
    if (!highlightText) {
      toast.error("Highlight text is required")
      return
    }

    const pageNumber = Number(page)
    if (!Number.isFinite(pageNumber) || pageNumber < 0) {
      toast.error("Page must be a positive number")
      return
    }

    startSaving(async () => {
      const result = await addManualBookHighlight({
        googleId: selectedGoogleId,
        highlightText,
        page: pageNumber,
      })

      if (!result.success) {
        toast.error(result.error || "Failed to save highlight")
        return
      }

      toast.success("Highlight added successfully")
      refresh()
      setIsOpen(false)
      resetForm()
    })
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={"secondary"}>
            <PlusIcon />
            Add Highlight
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-sm'>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>New book highlight</DialogTitle>
              <DialogDescription>
                Add a new highlight to your book.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <div className='flex items-center justify-between gap-2 mt-2'>
                <Field>
                  <Label htmlFor='book-1'>Book</Label>
                  <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id='book-1'
                        type='button'
                        variant='outline'
                        role='combobox'
                        className='w-full justify-between'
                      >
                        {selectedBook
                          ? `${selectedBook.title} - ${selectedBook.authors}`
                          : isBooksLoading
                            ? "Loading books..."
                            : "Select a currently reading book"}
                        <ChevronsUpDown className='opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
                      <Combobox>
                        <ComboboxInput
                          placeholder='Search by title or author'
                          value={bookQuery}
                          onChange={(event) => setBookQuery(event.target.value)}
                        />
                        <ComboboxContent className='border-0 rounded-none'>
                          <ComboboxList>
                            {filteredBooks.length === 0 ? (
                              <ComboboxEmpty>
                                No currently reading books found.
                              </ComboboxEmpty>
                            ) : (
                              filteredBooks.map((book) => (
                                <li key={book.id}>
                                  <ComboboxItem
                                    onClick={() => {
                                      setSelectedBookGoogleId(book.google_id)
                                      setBookQuery("")
                                      setIsPickerOpen(false)
                                    }}
                                    className='flex items-center justify-between gap-2'
                                  >
                                    <span className='truncate'>
                                      {book.title} - {book.authors}
                                    </span>
                                    <Check
                                      className={cn(
                                        "h-4 w-4",
                                        selectedBookGoogleId === book.google_id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </ComboboxItem>
                                </li>
                              ))
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field className='w-fit'>
                  <Label htmlFor='page-1'>Page</Label>
                  <Input
                    className='max-w-28'
                    id='page-1'
                    type='number'
                    min={0}
                    value={page}
                    onChange={(event) => setPage(event.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <Label htmlFor='highlight-1'>Highlight</Label>
                <Textarea
                  id='highlight-1'
                  name='highlight'
                  placeholder={placeholders[1]}
                  value={highlight}
                  onChange={(event) => setHighlight(event.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter className='mt-2'>
              <DialogClose asChild>
                <Button type='button' variant='outline' onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                isLoading={isSaving}
                disabled={isBooksLoading || books.length === 0}
              >
                Save changes
              </Button>
            </DialogFooter>
            {!isBooksLoading && books.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                No currently reading books found.
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddHighlight
