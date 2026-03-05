import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { ReadItDB } from '@/types/ReadItDatabase';

const schemaPath = path.join(process.cwd(), 'scripts', 'tables.sql');

function applySchema(db: Database.Database) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const statements = schema
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  for (const statement of statements) {
    db.exec(statement);
  }
}

export function createTestDatabase() {
  const sqlite = new Database(':memory:');
  applySchema(sqlite);

  const db = new Kysely<ReadItDB>({
    dialect: new SqliteDialect({
      database: sqlite,
    }),
  });

  return { db, sqlite };
}
