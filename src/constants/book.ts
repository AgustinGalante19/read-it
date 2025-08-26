export const BOOK_STATUS = {
  NOT_READ: 1,
  READING: 2,
  READ: 3,
} as const;

export const DEFAULT_IMAGES = {
  THUMBNAIL_FALLBACK: '/thumbnail-fallback.jpg',
  SMALL_THUMBNAIL_FALLBACK: '/small-thumbnail-fallback.jpg',
} as const;

export const REVALIDATION_PATHS = [
  '/book',
  '/',
  '/stats',
  '/calendar',
] as const;

export type BookStatusValue = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];
