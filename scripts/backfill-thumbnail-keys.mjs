import { LibsqlDialect } from '@libsql/kysely-libsql';
import { Kysely } from 'kysely';

const legacyBase = 'https://read-it.site/';
const keyPattern = /^(?:books\/)?[A-Za-z0-9_-]+\.(?:jpg|jpeg|png|webp|gif|avif)$/;
const localBase = new URL(process.env.THUMBNAIL_BASE_URL);
if (localBase.protocol !== 'https:' || localBase.username || localBase.password || localBase.search || localBase.hash) {
  throw new Error('THUMBNAIL_BASE_URL must be an HTTPS directory URL');
}
if (!localBase.pathname.endsWith('/')) localBase.pathname += '/';

const database = new Kysely({
  dialect: new LibsqlDialect({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});

try {
  const rows = await database.selectFrom('readit_books')
    .select(['id', 'thumbnail_url'])
    .where('thumbnail_key', 'is', null)
    .where('thumbnail_url', 'like', legacyBase + '%')
    .execute();
  const entries = rows.map((row) => {
    const key = row.thumbnail_url.slice(legacyBase.length);
    if (!keyPattern.test(key)) throw new Error(`Unexpected legacy thumbnail key for row ${row.id}`);
    return { ...row, key };
  });
  const keys = [...new Set(entries.map((entry) => entry.key))];

  for (let index = 0; index < keys.length; index += 8) {
    await Promise.all(keys.slice(index, index + 8).map(async (key) => {
      const response = await fetch(new URL(key, localBase), {
        method: 'HEAD',
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
        throw new Error(`Cover ${key} failed verification with status ${response.status}`);
      }
    }));
  }

  if (process.argv.includes('--apply')) {
    await database.transaction().execute(async (transaction) => {
      for (const entry of entries) {
        const result = await transaction.updateTable('readit_books')
          .set({ thumbnail_key: entry.key })
          .where('id', '=', entry.id)
          .where('thumbnail_url', '=', entry.thumbnail_url)
          .where('thumbnail_key', 'is', null)
          .executeTakeFirst();
        if (result.numUpdatedRows !== 1n) {
          throw new Error(`Row ${entry.id} changed during verification`);
        }
      }
    });
  }

  process.stdout.write(JSON.stringify({
    verifiedKeys: keys.length,
    verifiedRows: entries.length,
    applied: process.argv.includes('--apply'),
  }) + '\n');
} finally {
  await database.destroy();
}
