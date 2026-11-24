# Read It - Personal Reading Tracker 📚

A modern, intuitive reading tracker built with Next.js that helps you organize and monitor your reading journey. Track your reading progress, discover new books, and gain insights into your reading habits.

## ✨ Features

### 🏠 Home Dashboard

Your personal reading hub that displays:

- **Currently Reading**: Books you're actively reading
- **Read List**: Books you want to read
- **Completed Books**: Your reading achievements
- **All Books**: Complete library overview

![Screenshot_20251223_122436_Chrome](https://github.com/user-attachments/assets/b6dd0de7-e52d-4ba9-bd2a-52ccf60525c7)

### 🔍 Search & Discovery

Powerful book search functionality:

- Real-time book search powered by Google Books API
- Recent searches for quick access
- Detailed book information and previews
- Easy addition to your personal library

![Screenshot_20251223_122447_Chrome](https://github.com/user-attachments/assets/f04e1a58-8f10-4510-8df7-56b2063abb4f)

### 📘 Book Details

Complete view of each book's information:

- Full book information (title, author, publisher, etc.)
- Book cover and description
- Reading status and progress
- Tags and categories
- Actions to manage your reading

![Screenshot_20251223_124041_Chrome](https://github.com/user-attachments/assets/36673349-b3c1-430c-9360-f95049d184e9)

### 📖 Library Management

Comprehensive library organization:

- Filter books by status (Reading, Want to Read, Read)
- Sort by various criteria (date added, title, author)
- Detailed book information and management
- Reading progress tracking

![Screenshot_20251223_122505_Chrome](https://github.com/user-attachments/assets/53e5a545-803b-4977-a258-783238bbb7a1)

### 📊 Reading Statistics

Insightful analytics about your reading habits:

- General reading statistics (books read, pages read)
- Reading trends over the last 6 months
- Genre/tag analysis with radar charts
- Visual book grid and timeline

![Screenshot_20251223_122536_Chrome](https://github.com/user-attachments/assets/0d1a10f7-9dc8-4f7e-8972-7304166cccd0)

### 📅 Reading Calendar

Visual representation of your reading journey:

- Calendar view of completed books
- Track reading dates and patterns
- Monthly and yearly reading overview

> **Note**: Supports automatic synchronization with [Read-It KOReader plugin](https://github.com/AgustinGalante19/readit.koplugin) for seamless reading progress tracking across devices.

![Screenshot_20251223_124008_Chrome](https://github.com/user-attachments/assets/c7904372-4a28-463b-9eee-335fec7263a3)

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Turso (SQLite)
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React

## 📱 Mobile-First Design

The app is designed with a mobile-first approach, featuring a clean bottom navigation bar for easy access to all main features on any device.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js 20.19+ installed
- pnpm package manager
- Turso database account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AgustinGalante19/read-it.git
cd read-it
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables (database credentials, authentication keys, etc.)

4. Set up the database:
   - The SQL script to create the necessary tables is located in `scripts/tables.sql`
   - Run this script in your Turso database

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Migrating existing highlights

Before deploying the highlight categories update to an existing database, back it
up and pause writes from the app and KOReader. Apply
[`scripts/migrations/20261124_highlight_categories.sql`](scripts/migrations/20261124_highlight_categories.sql)
once, using a SQL client that stops on the first error. Run the complete file in
one transaction; if an error occurs, issue `ROLLBACK` and resolve it before retrying.
Fresh databases already use the new structure in `scripts/tables.sql` and must
not run this migration.

Check for records that require attention before migrating:

```sql
-- Each book must occur once per library.
SELECT user_email, google_id, COUNT(*) AS total
FROM readit_books
GROUP BY user_email, google_id
HAVING COUNT(*) > 1;

-- Every existing highlight must resolve to a book with an owner.
SELECT h.id, h.book_hash
FROM readit_books_highlights AS h
LEFT JOIN readit_books AS b ON b.book_hash = h.book_hash
WHERE b.id IS NULL OR b.user_email IS NULL;
```

The migration preserves highlight IDs, text, pages, dates and devices, fills in
`google_id` and `user_email`, and classifies existing records as quotes
(`is_note = 0`). Unresolved records or duplicate library books stop the migration;
they are not silently removed. Synthetic `manual-*` hashes are cleared only after
the new relationships have been populated. Verify with `PRAGMA foreign_key_check;`
before resuming writes with the updated app.

Highlights now belong to a book through `(user_email, google_id)`. `book_hash` is
optional file metadata, so changing a KOReader link does not detach saved records.
KOReader identifies books by hash and can classify imports with `isNote`. In the
app, records can be created or reclassified as quotes or research notes, with
separate tabs in `/highlights` and the book's highlights dialog.

### Sending quotes and notes from KOReader

`POST /api/koreader/highlights` accepts the existing fields and an optional
boolean `isNote`:

```json
{
  "book_hash": "the-linked-book-hash",
  "device_code": "your-device-code",
  "highlight_text": "Investigate Las meninas",
  "page": 42,
  "created_at": "2026-11-24T10:00:00Z",
  "isNote": true
}
```

Use `true` for a research note or `false` for a quote. Omitting `isNote` defaults
to `false`, so existing plugin versions continue to create quotes. It must be a
JSON boolean; strings such as `"true"`, numbers and `null` return HTTP 400.
The server resolves the book and owner from `book_hash` and `device_code` and
stores the category in `is_note`. The book must already be linked to that device's
user. No additional database migration is required for this API parameter.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
