'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { CircleAlert, SearchIcon, X } from 'lucide-react';
import type { Book } from '@/types/Book';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import SearchResults from './search-results';
import RecentSearches from './recent-searches';
import SearchSkeleton from './search-skeleton';

type SearchRequest = { query: string; delay: number };

type SearchResponse = {
  request: SearchRequest;
  books: Book[] | null;
};

export default function SearchForm() {
  const input = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [request, setRequest] = useState<SearchRequest>({ query: '', delay: 0 });
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const currentResponse = response?.request === request ? response : null;
  const isSearching = Boolean(request.query) && !currentResponse;

  useEffect(() => {
    if (!request.query) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ query: request.query });
        const result = await fetch('/api/books/search?' + params, {
          signal: controller.signal,
        });
        if (!result.ok) throw new Error('Search request failed');

        const books: Book[] = await result.json();
        if (!Array.isArray(books)) throw new Error('Invalid search response');

        if (!controller.signal.aborted) setResponse({ request, books });
      } catch {
        if (!controller.signal.aborted) setResponse({ request, books: null });
      }
    }, request.delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [request]);

  function changeQuery(value: string) {
    setSearchTerm(value);
    const query = value.trim();
    if (query !== request.query) setRequest({ query, delay: 500 });
  }

  function searchNow() {
    setRequest({ query: request.query, delay: 0 });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.query && (!currentResponse || currentResponse.books === null)) {
      searchNow();
    }
  }

  return (
    <>
      <form role='search' onSubmit={handleSubmit} className='w-full max-w-[720px]'>
        <InputGroup className='h-12 min-[1024px]:h-13'>
          <InputGroupInput
            ref={input}
            type='search'
            enterKeyHint='search'
            autoComplete='off'
            aria-label='Search books'
            placeholder='Search by title or author'
            value={searchTerm}
            className='h-full [&::-webkit-search-cancel-button]:hidden'
            onChange={(event) => changeQuery(event.target.value)}
          />
          <InputGroupAddon align='inline-start' className='ps-4'>
            <SearchIcon aria-hidden='true' />
          </InputGroupAddon>
          {searchTerm && (
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                size='icon-sm'
                className='size-12'
                aria-label='Clear search'
                onClick={() => {
                  changeQuery('');
                  input.current?.focus();
                }}
              >
                <X aria-hidden='true' />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </form>
      {request.query ? (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
            <h2 id='search-results-title' className='text-xl/7 font-medium'>Search results</h2>
            <p role='status' className='text-sm text-muted-foreground'>
              {isSearching ? 'Searching…' : currentResponse?.books && (
                currentResponse.books.length + (currentResponse.books.length === 1 ? ' result' : ' results')
              )}
            </p>
          </div>
          <section aria-labelledby='search-results-title' aria-busy={isSearching}>
            {isSearching ? (
              <SearchSkeleton />
            ) : currentResponse?.books === null ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant='icon'><CircleAlert aria-hidden='true' /></EmptyMedia>
                  <EmptyTitle>Couldn’t load results</EmptyTitle>
                  <EmptyDescription>Try the same search again.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button type='button' variant='outline' onClick={searchNow}>Try again</Button>
                </EmptyContent>
              </Empty>
            ) : currentResponse?.books.length ? (
              <SearchResults books={currentResponse.books} saveToHistory />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant='icon'><SearchIcon aria-hidden='true' /></EmptyMedia>
                  <EmptyTitle>No books found</EmptyTitle>
                  <EmptyDescription className='wrap-anywhere'>
                    Try a different title or author.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </section>
        </div>
      ) : (
        <RecentSearches />
      )}
    </>
  );
}
