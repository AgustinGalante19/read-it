# Library Refactoring

Este directorio contiene la refactorización del sistema de libros, separando responsabilidades en diferentes capas.

## Estructura

```
src/services/
├── Library.ts              # (Legacy) - Funciones deprecadas para retrocompatibilidad
├── BookService.ts          # Lógica de negocio para libros
├── StatsService.ts         # Lógica de negocio para estadísticas
├── repositories/
│   └── BookRepository.ts   # Acceso a datos de libros
├── constants/
│   └── book.ts            # Constantes relacionadas con libros
└── utils/
    └── BookValidation.ts  # Utilidades de validación
```

## Uso Recomendado

### En lugar de usar Library.ts (deprecado):

```typescript
// ❌ Deprecado
import { getMyBooks, addBook } from '@/services/Library';

// ✅ Nuevo enfoque
import { getMyBooks, addBook } from '@/services/BookService';

const booksResult = await getMyBooks('readed');
if (booksResult.success) {
  console.log(booksResult.data);
} else {
  console.error(booksResult.error);
}
```

### Para estadísticas:

```typescript
// ✅ Usar StatsService
import { getMyStats } from '@/services/StatsService';

const statsResult = await getMyStats();
if (statsResult.success) {
  console.log(statsResult.data);
}
```

### Para operaciones de base de datos directas:

```typescript
// ✅ Usar BookRepository (solo si es necesario)
import * as BookRepository from '@/services/repositories/BookRepository';

const userEmail = await getUserEmail();
const books = await BookRepository.findBooksByStatus(userEmail, 'readed');
```

## Nota sobre Server Actions

Cada función exportada de los servicios incluye `'use server'` individualmente, permitiendo que los archivos sean importables como módulos normales mientras mantienen la funcionalidad de server actions donde es necesario.

## Beneficios de la Refactorización

1. **Separación de Responsabilidades**: Repository, Service, y Controller están separados
2. **Manejo de Errores**: Mejor manejo con Result pattern
3. **Tipado**: Uso consistente de TypeScript
4. **Testabilidad**: Cada capa puede ser testeada independientemente
5. **Mantenibilidad**: Código más limpio y organizado
6. **Validación**: Validaciones centralizadas
7. **Constantes**: Valores mágicos convertidos en constantes

## Migración Gradual

Las funciones del `Library.ts` original están marcadas como `@deprecated` pero siguen funcionando para no romper código existente. Se recomienda migrar gradualmente:

1. Usar los nuevos servicios en nuevos componentes
2. Migrar gradualmente componentes existentes
3. Eventualmente remover las funciones deprecadas
