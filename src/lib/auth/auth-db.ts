import { Kysely } from 'kysely';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { ReadItDB } from '@/types/ReadItDatabase';

export const db = new Kysely<ReadItDB>({
  dialect: new LibsqlDialect({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }),
});
