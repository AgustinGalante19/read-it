import { Book } from '@/types/Book';
import { openDB } from 'idb';

const IDB_NAME = 'books';
const IDB_STORE_NAME = 'recent-books';

const initIDB = async () => {
  const db = await openDB(IDB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, {
          keyPath: 'google_id',
        });
      }
    },
  });
  return db;
};

export const addIDBBook = async (data: Book): Promise<void> => {
  const db = await initIDB();
  const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
  const store = tx.objectStore(IDB_STORE_NAME);
  await store.add(data);
  await tx.done;
};

export const getIDBBooks = async (): Promise<Book[]> => {
  const db = await initIDB();
  return await db.getAll(IDB_STORE_NAME);
};
