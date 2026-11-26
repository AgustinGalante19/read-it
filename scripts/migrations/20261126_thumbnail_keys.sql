-- Add the column before deploying the app. Assign keys in a separate step after verifying HTTPS.
ALTER TABLE readit_books ADD COLUMN thumbnail_key TEXT;
