"use client"

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Check, ChevronDown, NotebookPen, PlusIcon, Quote, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ComboboxEmpty, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { addManualBookHighlight } from "@/services/BookHighlightService"
import { getMyBooks } from "@/services/BookService"
import { cn } from "@/lib/utils"
import { BookStatus, type Book } from "@/types/Book"

const focusClassName = "focus-visible:ring-0 focus-visible:shadow-none"
const fieldControlClassName = cn(
  "rounded-xl border border-outline bg-surface-container text-foreground shadow-none",
  "focus-visible:border-outline aria-invalid:border-destructive!",
  focusClassName,
)
const segmentClassName = cn(
  "h-[42px] min-w-0 flex-1 rounded-none text-muted-foreground max-[600px]:h-12",
  "first:rounded-s-full last:rounded-e-full last:border-s last:border-outline hover:bg-foreground/8",
  "data-[state=on]:bg-secondary-container data-[state=on]:text-secondary-container-foreground",
  "data-[state=on]:hover:bg-[color-mix(in_oklch,var(--color-secondary-container-foreground)_8%,var(--color-secondary-container))] data-[state=on]:hover:text-secondary-container-foreground",
  focusClassName,
)
const textButtonClassName = cn("min-w-12 text-primary active:scale-none max-[600px]:h-12", focusClassName)

function fitVisualViewport(dialog: HTMLDivElement | null) {
  const viewport = window.visualViewport
  if (!dialog || !viewport) return

  const fit = () => {
    if (viewport.scale !== 1) {
      dialog.style.removeProperty("--dialog-viewport-height")
      dialog.style.removeProperty("--dialog-viewport-center")
      return
    }

    dialog.style.setProperty("--dialog-viewport-height", `${viewport.height}px`)
    dialog.style.setProperty("--dialog-viewport-center", `${viewport.offsetTop + viewport.height / 2}px`)
  }

  fit()
  viewport.addEventListener("resize", fit)
  viewport.addEventListener("scroll", fit)
  return () => {
    viewport.removeEventListener("resize", fit)
    viewport.removeEventListener("scroll", fit)
  }
}

function AddHighlight() {
  const { refresh } = useRouter()
  const id = useId()
  const bookControl = useRef<HTMLButtonElement>(null)
  const pageControl = useRef<HTMLInputElement>(null)
  const textControl = useRef<HTMLTextAreaElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isSaving, startSaving] = useTransition()
  const [isBooksLoading, startLoadingBooks] = useTransition()
  const [books, setBooks] = useState<Book[]>([])
  const [booksError, setBooksError] = useState("")
  const [selectedBookGoogleId, setSelectedBookGoogleId] = useState("")
  const [bookQuery, setBookQuery] = useState("")
  const [highlight, setHighlight] = useState("")
  const [page, setPage] = useState("")
  const [isNote, setIsNote] = useState(false)
  const [invalidField, setInvalidField] = useState<"book" | "page" | "text" | null>(null)
  const [saveError, setSaveError] = useState("")

  const loadBooks = useCallback(() => {
    startLoadingBooks(async () => {
      try {
        const response = await getMyBooks(BookStatus.READING)
        if (response.success && response.data) {
          setBooks(response.data)
          setBooksError("")
        } else {
          setBooksError(response.error || "Couldn’t load your books.")
        }
      } catch {
        setBooksError("Couldn’t load your books.")
      }
    })
  }, [])

  useEffect(loadBooks, [loadBooks])

  const query = bookQuery.trim().toLowerCase()
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.authors}`.toLowerCase().includes(query),
  )
  const selectedBook = books.find((book) => book.google_id === selectedBookGoogleId)
  const kind = isNote ? "note" : "quote"
  const KindIcon = isNote ? NotebookPen : Quote
  const bookUnavailable = isBooksLoading || books.length === 0

  const changePickerOpen = (open: boolean) => {
    setIsPickerOpen(open)
    if (!open) setBookQuery("")
  }

  const resetForm = () => {
    setSelectedBookGoogleId("")
    setHighlight("")
    setPage("")
    setIsNote(false)
    setInvalidField(null)
    setSaveError("")
    changePickerOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving || bookUnavailable) return
    setSaveError("")

    if (!selectedBook?.google_id) {
      setInvalidField("book")
      bookControl.current?.focus()
      return
    }

    const pageNumber = Number(page)
    if (pageControl.current?.validity.badInput || !Number.isInteger(pageNumber) || pageNumber < 0) {
      setInvalidField("page")
      pageControl.current?.focus()
      return
    }

    const highlightText = highlight.trim()
    if (!highlightText) {
      setInvalidField("text")
      textControl.current?.focus()
      return
    }

    const googleId = selectedBook.google_id
    setInvalidField(null)
    startSaving(async () => {
      try {
        const result = await addManualBookHighlight({ googleId, highlightText, page: pageNumber, isNote })
        if (!result.success) {
          setSaveError(result.error || `Couldn’t save your ${kind}. Try again.`)
          return
        }
      } catch {
        setSaveError(`Couldn’t save your ${kind}. Try again.`)
        return
      }

      toast.success(isNote ? "Note added successfully" : "Quote added successfully")
      refresh()
      setIsOpen(false)
      resetForm()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (isSaving) return
      setIsOpen(open)
      if (!open) changePickerOpen(false)
    }}>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <PlusIcon data-icon='inline-start' />
          Add Highlight
        </Button>
      </DialogTrigger>
      <DialogContent
        ref={fitVisualViewport}
        showCloseButton={false}
        className={cn(
          "top-[var(--dialog-viewport-center,50%)] flex max-h-[calc(var(--dialog-viewport-height,100dvh)-2rem)] w-[calc(100%-2rem)] max-w-[520px] flex-col gap-0 sm:max-w-[520px]",
          "overflow-hidden rounded-3xl border-0 bg-surface-container-high p-0 shadow-md [@media(height<420px)]:overflow-y-auto",
          "[--dialog-padding:1rem] min-[600px]:[--dialog-padding:1.5rem]",
        )}
      >
        <form onSubmit={handleSubmit} noValidate aria-busy={isSaving} className='flex min-h-0 flex-col [@media(height<420px)]:flex-none'>
          <DialogHeader className='flex-none flex-row items-center gap-3 px-(--dialog-padding) pt-5 pb-5 text-start min-[600px]:pt-6 sm:text-start'>
            <span className='grid size-12 flex-none place-items-center rounded-2xl bg-primary-container text-primary-container-foreground' aria-hidden='true'>
              <KindIcon className='size-[22px]' />
            </span>
            <div className='min-w-0'>
              <DialogTitle className='text-2xl/8 font-normal'>New book {kind}</DialogTitle>
              <DialogDescription>Save to a book you’re currently reading.</DialogDescription>
            </div>
          </DialogHeader>

          <div className='overflow-auto overscroll-contain scroll-py-2 px-(--dialog-padding) pt-1 pb-5 [@media(height<420px)]:overflow-visible'>
            <FieldGroup className='gap-5'>
              <ToggleGroup
                type='single'
                role='radiogroup'
                aria-label='Highlight type'
                value={kind}
                onValueChange={(value) => { if (value) setIsNote(value === "note") }}
                disabled={isSaving}
                className='w-full gap-0 rounded-full border border-outline'
              >
                <ToggleGroupItem value='quote' className={segmentClassName}>
                  {isNote ? <Quote aria-hidden='true' /> : <Check aria-hidden='true' />}
                  Quote
                </ToggleGroupItem>
                <ToggleGroupItem value='note' className={segmentClassName}>
                  {isNote ? <Check aria-hidden='true' /> : <NotebookPen aria-hidden='true' />}
                  Note
                </ToggleGroupItem>
              </ToggleGroup>

              <div className='grid grid-cols-[minmax(0,1fr)_96px] gap-x-3 gap-y-2 max-[600px]:grid-cols-[minmax(0,1fr)_84px]'>
                <Field className='min-w-0 gap-2' data-invalid={invalidField === "book"}>
                  <FieldLabel id={`${id}-book-label`} htmlFor={`${id}-book`}>Book</FieldLabel>
                  <Popover open={isPickerOpen} onOpenChange={changePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        ref={bookControl}
                        id={`${id}-book`}
                        type='button'
                        variant='ghost'
                        disabled={bookUnavailable || isSaving}
                        aria-labelledby={`${id}-book-label ${id}-book-value`}
                        aria-invalid={invalidField === "book"}
                        aria-describedby={invalidField === "book" ? `${id}-book-error` : undefined}
                        className={cn(
                          fieldControlClassName,
                          "h-13 justify-start px-3 text-start hover:border-primary hover:bg-surface-container active:scale-none [&>svg]:text-muted-foreground data-[state=open]:border-primary",
                        )}
                      >
                        {isBooksLoading ? <Spinner data-icon='inline-start' /> : <BookOpen data-icon='inline-start' aria-hidden='true' />}
                        <span id={`${id}-book-value`} className='flex min-w-0 flex-1 flex-col items-start'>
                          <span className='max-w-full truncate'>
                            {selectedBook?.title || (isBooksLoading ? "Loading books…" : "Select a book")}
                          </span>
                          {selectedBook?.authors && <span className='max-w-full truncate text-xs text-muted-foreground'>{selectedBook.authors}</span>}
                        </span>
                        <ChevronDown data-icon='inline-end' aria-hidden='true' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align='start'
                      collisionPadding={16}
                      sideOffset={8}
                      aria-label='Choose a book'
                      className='flex max-h-[var(--radix-popover-content-available-height)] w-[max(15rem,var(--radix-popover-trigger-width))] max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-2xl p-2'
                    >
                      <InputGroup className='h-11 flex-none focus-within:shadow-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid focus-within:outline-ring has-[[data-slot=input-group-control]:focus-visible]:ring-0'>
                        <InputGroupAddon><Search aria-hidden='true' /></InputGroupAddon>
                        <InputGroupInput
                          type='search'
                          aria-label='Search books by title or author'
                          placeholder='Search title or author'
                          className='focus-visible:outline-none! md:text-base'
                          value={bookQuery}
                          onChange={(event) => setBookQuery(event.target.value)}
                        />
                      </InputGroup>
                      {filteredBooks.length > 0 ? (
                        <ComboboxList className='min-h-0 overscroll-contain'>
                          {filteredBooks.map((book) => (
                            <li key={book.id}>
                              <ComboboxItem
                                aria-label={book.authors ? `${book.title}, ${book.authors}` : book.title}
                                aria-current={selectedBookGoogleId === book.google_id ? "true" : undefined}
                                className={cn(
                                  "flex min-h-12 items-center gap-2 text-popover-foreground hover:bg-foreground/8 hover:text-popover-foreground",
                                  "aria-[current=true]:bg-primary-container aria-[current=true]:text-primary-container-foreground",
                                  focusClassName,
                                )}
                                onClick={() => {
                                  setSelectedBookGoogleId(book.google_id)
                                  if (invalidField === "book") setInvalidField(null)
                                  changePickerOpen(false)
                                }}
                              >
                                <span className='flex min-w-0 flex-1 flex-col'>
                                  <span className='line-clamp-2'>{book.title}</span>
                                  {book.authors && <span className='truncate text-xs'>{book.authors}</span>}
                                </span>
                                {selectedBookGoogleId === book.google_id && <Check size={18} aria-hidden='true' />}
                              </ComboboxItem>
                            </li>
                          ))}
                        </ComboboxList>
                      ) : (
                        <ComboboxEmpty role='status'>No matching books.</ComboboxEmpty>
                      )}
                    </PopoverContent>
                  </Popover>
                  {invalidField === "book" && <FieldError id={`${id}-book-error`}>Choose a book.</FieldError>}
                </Field>

                <Field className='min-w-0 gap-2' data-invalid={invalidField === "page"}>
                  <div className='flex items-baseline justify-between gap-1'>
                    <FieldLabel htmlFor={`${id}-page`}>Page</FieldLabel>
                    <span id={`${id}-page-hint`} className='text-xs text-muted-foreground'>Optional</span>
                  </div>
                  <Input
                    ref={pageControl}
                    className={cn(fieldControlClassName, "h-13")}
                    id={`${id}-page`}
                    type='number'
                    inputMode='numeric'
                    min={0}
                    step={1}
                    placeholder='—'
                    value={page}
                    readOnly={isSaving}
                    aria-invalid={invalidField === "page"}
                    aria-describedby={invalidField === "page" ? `${id}-page-error` : `${id}-page-hint`}
                    onChange={(event) => {
                      setPage(event.target.value)
                      if (invalidField === "page") setInvalidField(null)
                    }}
                  />
                </Field>
                {invalidField === "page" && <FieldError id={`${id}-page-error`} className='col-span-full justify-self-end'>Enter a non-negative whole page number.</FieldError>}
                {!isBooksLoading && books.length === 0 && (
                  <div className='col-span-full flex flex-wrap items-center gap-2'>
                    {booksError ? (
                      <>
                        <FieldError>{booksError}</FieldError>
                        <Button type='button' variant='ghost' className={textButtonClassName} onClick={loadBooks}>Retry</Button>
                      </>
                    ) : (
                      <FieldDescription role='status'>You have no books marked as Currently Reading.</FieldDescription>
                    )}
                  </div>
                )}
              </div>

              <Field className='gap-2' data-invalid={invalidField === "text"}>
                <FieldLabel htmlFor={`${id}-text`}>{isNote ? "Note" : "Quote"}</FieldLabel>
                <Textarea
                  ref={textControl}
                  id={`${id}-text`}
                  name='highlight'
                  required
                  readOnly={isSaving}
                  className={cn(fieldControlClassName, "min-h-36 max-h-70 resize-y bg-surface-container! px-3.5 py-3 text-base/6.5 placeholder:text-muted-foreground md:text-base/6.5")}
                  placeholder={isNote ? "Write a thought, idea, or question…" : "Write or paste a passage…"}
                  value={highlight}
                  aria-invalid={invalidField === "text"}
                  aria-describedby={invalidField === "text" ? `${id}-text-error` : undefined}
                  onChange={(event) => {
                    setHighlight(event.target.value)
                    if (invalidField === "text") setInvalidField(null)
                  }}
                />
                {invalidField === "text" && <FieldError id={`${id}-text-error`}>Enter a {kind}.</FieldError>}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className='flex-none flex-col px-(--dialog-padding) pb-(--dialog-padding) sm:flex-col'>
            {saveError && <FieldError className='text-left'>{saveError}</FieldError>}
            <div className='flex flex-wrap items-center justify-end gap-2'>
              <DialogClose asChild>
                <Button type='button' variant='ghost' disabled={isSaving} className={textButtonClassName} onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit' className={cn("min-w-[108px] active:scale-none max-[600px]:h-12", focusClassName)} disabled={bookUnavailable} isLoading={isSaving}>
                {isSaving ? "Saving…" : `Save ${kind}`}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddHighlight
