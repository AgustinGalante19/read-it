# Self-hosted thumbnails

Keep the existing files at the root and in `books/` under
`/home/agustinnb/Proyectos/read-it/thumbnails`. The Nginx container serves
`/thumbnails/<key>` and accepts authenticated `PUT` and `DELETE` on the same
paths. Caddy terminates HTTPS. The storage container listens only on the
shared Docker network.

## Start the storage service

On `agustin-nb`, run `bash deploy/thumbnails/activate-agustin-nb.sh` from
the Read It project directory as `agustinnb`. The script uses interactive
`sudo`, checks the internal service, and reloads the existing Track It Caddy
container. It saves backups of the Caddyfile and Compose manifest before
adding the new site and its persistent Caddyfile mount.

Use the Docker network that the running Caddy container is attached to. Run
the following manual setup on other hosts as a user authorized to manage
that deployment.

```sh
export THUMBNAIL_DIRECTORY=/home/agustinnb/Proyectos/read-it/thumbnails
export THUMBNAIL_DOCKER_NETWORK=your-caddy-network
export THUMBNAIL_UID=1000
export THUMBNAIL_GID=1000
umask 077
export THUMBNAIL_PASSWORD_FILE="$HOME/.read-it-thumbnails.htpasswd"
htpasswd -cB "$THUMBNAIL_PASSWORD_FILE" readit
docker compose -f deploy/thumbnails/compose.yaml run --rm --no-deps --entrypoint nginx readit-thumbnails -t
docker compose -f deploy/thumbnails/compose.yaml up -d
```

Use a generated password for the `readit` account and save it for Vercel.
The UID and GID should match the owner of the thumbnail directory and the
password file should be readable by this UID. The `-c` flag creates a new
password file. Omit it to update an existing file.

Add this hostname to the existing Caddy configuration and validate the
configuration before reloading it.

```caddyfile
read-it-nb.duckdns.org {
    reverse_proxy readit-thumbnails:8080
}
```

Check from outside the LAN that both a root cover and a `books/` cover
return `200` over HTTPS. Check that an unauthenticated write returns `401`.
Exercise authenticated upload, read and delete using a new test key.

## Switch the Vercel app

1. Back up Turso and apply
   [the schema migration](../../scripts/migrations/20261126_thumbnail_keys.sql).
2. Set `THUMBNAIL_BASE_URL=https://read-it-nb.duckdns.org/thumbnails/` and
   `THUMBNAIL_WRITE_PASSWORD` in Vercel, then deploy the app. New uploads use
   unique keys under `books/uploads/`. Removing a book deletes its own new
   upload. For migrated shared covers, remove a file only after confirming
   that no library row references its key.
3. Run the backfill from the repository root with the Turso and thumbnail
   variables in your shell or `.env.local`:

   ```sh
   node --env-file=.env.local scripts/backfill-thumbnail-keys.mjs
   node --env-file=.env.local scripts/backfill-thumbnail-keys.mjs --apply
   ```

   Both commands verify all pending cover URLs over HTTPS. Only `--apply`
   writes to Turso. Existing URLs are kept as fallbacks, including external
   covers. R2 can be retired once the library, calendar, highlights and new
   book workflow have been verified against the new storage.
