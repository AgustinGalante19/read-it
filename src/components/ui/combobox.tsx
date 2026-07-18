"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Combobox({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='combobox'
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function ComboboxInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot='combobox-input'
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 rounded-full border bg-surface-container px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='combobox-content'
      className={cn(
        "rounded-xl border bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot='combobox-list'
      className={cn("max-h-56 overflow-auto p-1", className)}
      {...props}
    />
  )
}

function ComboboxItem({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot='combobox-item'
      type='button'
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot='combobox-empty'
      className={cn("px-3 py-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
}
