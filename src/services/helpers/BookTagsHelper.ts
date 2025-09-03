import { Book } from '@/types/Book';
import { TagRadarData } from '@/types/Stats';

class BookTagsHelper {
  normalizeBookTags(bookTags: { tags: string }[]): Set<string> {
    const unrepeatedTags = new Set(
      bookTags.flatMap(({ tags }) => {
        if (!tags) {
          return '';
        } else {
          return tags.split('/').map((subTag: string) => subTag.trim());
        }
      })
    );
    return unrepeatedTags;
  }

  getMostFrequentTag(tags: string) {
    const splittedTags: string[] = tags.split('/').map((tag) => tag.trim());

    const tagCount: Record<string, number> = splittedTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentTag = Object.keys(tagCount).reduce((maxTag, currentTag) =>
      tagCount[currentTag] > tagCount[maxTag] ? currentTag : maxTag
    );

    return mostFrequentTag;
  }

  processTagsForRadar(books: Book[]): TagRadarData[] {
    const tagCounts: Record<string, number> = {};

    // Procesar todos los tags de todos los libros
    books.forEach((book) => {
      if (book.tags) {
        // Dividir por comas y limpiar espacios
        const tags = book.tags.split(',').map((tag) => tag.trim());

        tags.forEach((tag) => {
          if (tag) {
            // Normalizar el tag (remover "Fiction / " del inicio si existe)
            let normalizedTag = tag;
            if (tag.startsWith('Fiction / ')) {
              normalizedTag = tag.replace('Fiction / ', '');
            }

            // Simplificar algunos tags comunes
            if (normalizedTag.includes('Mystery & Detective')) {
              normalizedTag = 'Mystery & Detective';
            }
            if (normalizedTag.includes('Science Fiction')) {
              normalizedTag = 'Science Fiction';
            }
            if (normalizedTag.includes('Thrillers')) {
              normalizedTag = 'Thrillers';
            }
            if (normalizedTag === 'General') {
              normalizedTag = 'General Fiction';
            }

            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
          }
        });
      }
    });

    // Convertir a array y ordenar por frecuencia
    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // Retornar los top 8 tags para el radar (para que se vea bien)
    return sortedTags.slice(0, 8);
  }
}

const bookTagsHelper = new BookTagsHelper();

export default bookTagsHelper;
