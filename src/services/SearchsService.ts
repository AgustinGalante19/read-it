import { Book } from '@/types/Book';
import { RecentSearch } from '@/types/RecentSearch';
import { openDB } from 'idb';

class BookSearchService {
  private IDB_NAME = 'books';
  private IDB_STORE_NAME = 'recent-books';

  private async initIDB() {
    const storeName = this.IDB_STORE_NAME;
    const db = await openDB(this.IDB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: 'google_id',
          });
        }
      },
    });
    return db;
  }

  async getIDBBooks(): Promise<RecentSearch[]> {
    const db = await this.initIDB();
    const books = await db.getAll(this.IDB_STORE_NAME);
    // Ordenar por timestamp más reciente primero
    return books.sort((a, b) => b.searchTimestamp - a.searchTimestamp);
  }

  async addIDBBook(data: Book): Promise<void> {
    const db = await this.initIDB();
    const tx = db.transaction(this.IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.IDB_STORE_NAME);

    // Agregar timestamp al libro
    const recentSearch: RecentSearch = {
      ...data,
      searchTimestamp: Date.now(),
    };

    // Usar put en lugar de add para actualizar el timestamp si ya existe
    await store.put(recentSearch);
    await tx.done;
  }

  async removeIDBBooks(): Promise<void> {
    const db = await this.initIDB();
    const tx = db.transaction(this.IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.IDB_STORE_NAME);
    await store.clear();
    await tx.done;
  }
}

export const bookSearchService = new BookSearchService();
