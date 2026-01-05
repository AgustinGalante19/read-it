-- numbers definition
CREATE TABLE
  numbers (number INTEGER PRIMARY KEY);

-- readit_book_status definition
CREATE TABLE
  readit_book_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cd_status text not null,
    ds_status text not null
  );

-- readit_book_type definition
CREATE TABLE
  readit_book_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    code text
  );

-- readit_users definition
CREATE TABLE
  readit_users (
    email varchar(100) NOT NULL,
    "name" varchar(100) NULL,
    CONSTRAINT readit_users_pkey PRIMARY KEY (email)
  );

-- readit_books definition
CREATE TABLE
  "readit_books" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT NOT NULL,
    title TEXT NOT NULL,
    thumbnail_url TEXT,
    authors TEXT,
    publish_date TEXT,
    page_count INTEGER,
    inserted_at TEXT NOT NULL DEFAULT (datetime ('now')),
    start_date TEXT,
    finish_date TEXT,
    tags TEXT,
    user_email TEXT,
    id_book_status INTEGER,
    book_hash TEXT default null,
    book_total_read_time INTEGER default null,
    book_total_read_pages INTEGER default null,
    book_last_open TEXT default null,
    book_type_id INTEGER references readit_book_type (id),
    FOREIGN KEY (user_email) REFERENCES readit_users (email),
    FOREIGN KEY (id_book_status) REFERENCES readit_book_status (id)
  );

CREATE UNIQUE INDEX idx_readit_books_book_hash ON readit_books (book_hash);

-- readit_user_devices definition
CREATE TABLE
  readit_user_devices (
    id INTEGER PRIMARY KEY,
    user_email TEXT NOT NULL references readit_users (email),
    device_code TEXT NOT NULL UNIQUE,
    device_name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime ('now'))
  );

-- readit_page_stat_data definition
CREATE TABLE
  "readit_page_stat_data" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    page INTEGER NOT NULL,
    start_time INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    total_pages INTEGER NOT NULL,
    user_device_code TEXT references readit_user_devices (device_code),
    UNIQUE (hash, start_time, page)
  );

-- readit_book_highlights definition
CREATE TABLE
  readit_books_highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_code TEXT,
    highlight_text TEXT,
    book_hash TEXT,
    page NUMBER,
    created_at TEXT,
    FOREIGN KEY (device_code) REFERENCES readit_user_devices (device_code),
    FOREIGN KEY (book_hash) REFERENCES readit_books (book_hash)
  );

-- better-auth user definition
CREATE TABLE
  user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

-- better-auth session definition
CREATE TABLE
  session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
  );

-- better-auth account definition
CREATE TABLE
  account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    idToken TEXT,
    password TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
  );

-- better-auth verification definition
CREATE TABLE
  verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );