-- One-time migration from the original hash-based highlight table.
-- Run as one transaction, with no concurrent writes, before deploying the new app.
-- Keep foreign_keys enabled. If any statement fails, ROLLBACK and investigate;
-- do not continue with the remaining statements.
BEGIN IMMEDIATE;

CREATE UNIQUE INDEX idx_readit_books_user_google_id
  ON readit_books (user_email, google_id);

CREATE TABLE readit_books_highlights_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_code TEXT,
  highlight_text TEXT,
  book_hash TEXT,
  google_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  is_note INTEGER NOT NULL DEFAULT 0 CHECK (is_note IN (0, 1)),
  page NUMBER,
  created_at TEXT,
  FOREIGN KEY (device_code) REFERENCES readit_user_devices (device_code),
  FOREIGN KEY (user_email, google_id) REFERENCES readit_books (user_email, google_id)
);

-- LEFT JOIN deliberately preserves every source row. An unresolved book or
-- owner fails the NOT NULL constraints instead of silently dropping highlights.
INSERT INTO readit_books_highlights_new (
  id, device_code, highlight_text, book_hash, google_id, user_email,
  is_note, page, created_at
)
SELECT
  h.id, h.device_code, h.highlight_text,
  CASE WHEN h.book_hash GLOB 'manual-*' THEN NULL ELSE h.book_hash END,
  b.google_id, b.user_email, 0, h.page, h.created_at
FROM readit_books_highlights AS h
LEFT JOIN readit_books AS b ON b.book_hash = h.book_hash;

-- Preserve the AUTOINCREMENT high-water mark, even if the latest IDs were deleted.
INSERT INTO sqlite_sequence (name, seq)
SELECT 'readit_books_highlights_new', seq FROM sqlite_sequence
WHERE name = 'readit_books_highlights'
  AND NOT EXISTS (SELECT 1 FROM sqlite_sequence WHERE name = 'readit_books_highlights_new');
UPDATE sqlite_sequence
SET seq = MAX(seq, COALESCE((SELECT seq FROM sqlite_sequence WHERE name = 'readit_books_highlights'), 0))
WHERE name = 'readit_books_highlights_new';

DROP TABLE readit_books_highlights;
ALTER TABLE readit_books_highlights_new RENAME TO readit_books_highlights;

CREATE INDEX idx_readit_books_highlights_user_book
  ON readit_books_highlights (user_email, google_id);

-- Only clear synthetic hashes after every highlight has a stable book link.
UPDATE readit_books SET book_hash = NULL WHERE book_hash GLOB 'manual-*';

COMMIT;
