import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const migration = readFileSync(join(process.cwd(), 'scripts/migrations/20261124_highlight_categories.sql'), 'utf8');
let sqlite: Database.Database;

// Frozen subset of the original schema, independent of the new table definition.
const legacySchema = `
  CREATE TABLE readit_users (email TEXT PRIMARY KEY);
  CREATE TABLE readit_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT NOT NULL,
    user_email TEXT REFERENCES readit_users(email),
    book_hash TEXT
  );
  CREATE UNIQUE INDEX idx_readit_books_book_hash ON readit_books(book_hash);
  CREATE TABLE readit_user_devices (
    device_code TEXT PRIMARY KEY,
    user_email TEXT REFERENCES readit_users(email)
  );
  CREATE TABLE readit_books_highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_code TEXT REFERENCES readit_user_devices(device_code),
    highlight_text TEXT,
    book_hash TEXT REFERENCES readit_books(book_hash),
    page NUMBER,
    created_at TEXT
  );
`;

describe('highlight categories migration', () => {
  beforeEach(() => {
    sqlite = new Database(':memory:');
    sqlite.pragma('foreign_keys = ON');
    sqlite.exec(legacySchema);
    sqlite.exec(`
      INSERT INTO readit_users VALUES ('user@test.com');
      INSERT INTO readit_user_devices VALUES ('dev', 'user@test.com');
      INSERT INTO readit_books (google_id, user_email, book_hash) VALUES
        ('physical', 'user@test.com', 'manual-abc'),
        ('digital', 'user@test.com', 'real-hash');
      INSERT INTO readit_books_highlights (id, device_code, highlight_text, book_hash, page, created_at) VALUES
        (7, NULL, 'Manual citation', 'manual-abc', 12, '2026-10-19T11:50:06.000Z'),
        (9, 'dev', 'Imported citation', 'real-hash', 403, '2026-10-20T11:50:06.000Z');
      INSERT INTO readit_books_highlights (id, book_hash) VALUES (30, 'real-hash');
      DELETE FROM readit_books_highlights WHERE id = 30;
    `);
  });

  afterEach(() => {
    if (sqlite.inTransaction) sqlite.exec('ROLLBACK');
    sqlite.close();
  });

  it('preserves every highlight, its identity, metadata and owner, and removes synthetic hashes', () => {
    sqlite.exec(migration);
    expect(sqlite.prepare('SELECT * FROM readit_books_highlights ORDER BY id').all()).toEqual([
      { id: 7, device_code: null, highlight_text: 'Manual citation', book_hash: null,
        google_id: 'physical', user_email: 'user@test.com', is_note: 0, page: 12, created_at: '2026-10-19T11:50:06.000Z' },
      { id: 9, device_code: 'dev', highlight_text: 'Imported citation', book_hash: 'real-hash',
        google_id: 'digital', user_email: 'user@test.com', is_note: 0, page: 403, created_at: '2026-10-20T11:50:06.000Z' },
    ]);
    expect(sqlite.prepare('SELECT book_hash FROM readit_books ORDER BY id').all()).toEqual([
      { book_hash: null }, { book_hash: 'real-hash' },
    ]);
    expect(sqlite.pragma('foreign_key_check')).toEqual([]);
    sqlite.exec("UPDATE readit_books SET book_hash = 'new-hash' WHERE google_id = 'digital'");
    expect(sqlite.prepare('SELECT COUNT(*) AS total FROM readit_books_highlights').get()).toEqual({ total: 2 });
    const inserted = sqlite.prepare(`
      INSERT INTO readit_books_highlights (google_id, user_email, is_note)
      VALUES ('physical', 'user@test.com', 1)
    `).run();
    expect(Number(inserted.lastInsertRowid)).toBeGreaterThan(30);
  });

  it('aborts before replacing the original table when a highlight has no matching book', () => {
    sqlite.pragma('foreign_keys = OFF');
    sqlite.exec("INSERT INTO readit_books_highlights (book_hash) VALUES ('orphan')");
    sqlite.pragma('foreign_keys = ON');
    expect(() => sqlite.exec(migration)).toThrow(/NOT NULL/);
    sqlite.exec('ROLLBACK');
    expect(sqlite.prepare('SELECT COUNT(*) AS total FROM readit_books_highlights').get()).toEqual({ total: 3 });
    expect(sqlite.prepare("SELECT book_hash FROM readit_books WHERE google_id = 'physical'").get()).toEqual({ book_hash: 'manual-abc' });
  });

  it('aborts on duplicate entries for the same book and owner without changing existing data', () => {
    sqlite.exec("INSERT INTO readit_books (google_id, user_email) VALUES ('physical', 'user@test.com')");
    expect(() => sqlite.exec(migration)).toThrow(/UNIQUE/);
    sqlite.exec('ROLLBACK');
    expect(sqlite.prepare('SELECT COUNT(*) AS total FROM readit_books_highlights').get()).toEqual({ total: 2 });
  });
});
