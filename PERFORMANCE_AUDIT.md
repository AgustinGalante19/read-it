# Read-It Performance Audit

Análisis basado en **Vercel React Best Practices** (57 reglas, 8 categorías).

**Fecha**: Enero 2026  
**Versión analizada**: Next.js 15 con App Router

---

## Resumen Ejecutivo

| Categoría | Issues Críticos | Issues Medios | Issues Bajos |
|-----------|-----------------|---------------|--------------|
| Seguridad (Server Actions/API) | 4 | 0 | 0 |
| Waterfalls | 2 | 3 | 0 |
| Bundle Size | 0 | 4 | 0 |
| Server-Side Performance | 1 | 3 | 2 |
| Client-Side Patterns | 0 | 5 | 3 |
| Re-render Optimization | 0 | 2 | 1 |

---

## 1. Problemas de Seguridad (CRÍTICOS)

### 1.1 API Route sin autenticación

**Archivo**: `src/app/api/koreader/highlights/route.ts`  
**Regla violada**: `server-auth-actions`

```typescript
// ❌ ACTUAL - Sin validación de device_code
export async function POST(request: Request) {
  const { book_hash, created_at, device_code, highlight_text, page } =
    await request.json();
  const result = await addBookHighlight({...});
  return Response.json(result);
}

// ✅ CORRECTO - Validar device_code como las otras rutas
export async function POST(request: Request) {
  const { book_hash, created_at, device_code, highlight_text, page } =
    await request.json();
  
  const isValid = await validateDeviceCode(device_code);
  if (!isValid) {
    return Response.json({ error: 'Invalid device code' }, { status: 401 });
  }
  
  const result = await addBookHighlight({...});
  return Response.json(result);
}
```

### 1.2 Server Action sin verificación de ownership

**Archivo**: `src/services/BookHighlightService.ts:24-36`  
**Regla violada**: `server-auth-actions`

```typescript
// ❌ ACTUAL - Cualquier usuario puede eliminar cualquier highlight
export async function deleteBookHighlight(highlightId: number) {
  await bookHighlightsRepository.deleteHighlight(highlightId);
}

// ✅ CORRECTO - Verificar que el highlight pertenezca al usuario
export async function deleteBookHighlight(highlightId: number) {
  const userEmail = await getUserEmail();
  await isAuthenticated(userEmail);
  
  const highlight = await bookHighlightsRepository.getHighlightById(highlightId);
  if (!highlight || highlight.userEmail !== userEmail) {
    throw new Error('Unauthorized');
  }
  
  await bookHighlightsRepository.deleteHighlight(highlightId);
}
```

### 1.3 Server Action `addBookHighlight` sin auth

**Archivo**: `src/services/BookHighlightService.ts:12-22`  
**Regla violada**: `server-auth-actions`

La función es llamada desde la API route sin autenticación. Agregar validación interna.

### 1.4 `deleteUserDevice` sin ownership check

**Archivo**: `src/services/UserDevicesService.ts:45-56`  
**Regla violada**: `server-auth-actions`

Verificar que el device pertenezca al usuario actual antes de eliminar.

---

## 2. Waterfalls (CRÍTICOS)

### 2.1 Fetching secuencial en `getMyStats`

**Archivo**: `src/services/ReadingStatisticsService.ts:261-333`  
**Regla violada**: `async-parallel`  
**Impacto**: 2-5x más lento

```typescript
// ❌ ACTUAL - Secuencial
const tags = await getTags();
const lastMonthBooks = await getBooksFromDateRange(...);
const last3MonthBooks = await getBooksFromDateRange(...);
const last6MonthBooks = await getBooksFromDateRange(...);
const pageCount = await getPageCount();
// ... más llamadas secuenciales

// ✅ CORRECTO - Paralelo
const [
  tags,
  lastMonthBooks,
  last3MonthBooks,
  last6MonthBooks,
  pageCount,
  // ... resto
] = await Promise.all([
  getTags(),
  getBooksFromDateRange(...),
  getBooksFromDateRange(...),
  getBooksFromDateRange(...),
  getPageCount(),
  // ... resto
]);
```

### 2.2 Fetching secuencial en `getCalendarData`

**Archivo**: `src/services/ReadingStatisticsService.ts:72-83`  
**Regla violada**: `async-parallel`

```typescript
// ❌ ACTUAL
const dailyStats = await getDailyReadingStats(month, year, userEmail);
const booksFinished = await getBooksFinishedInMonth(month, year, userEmail);

// ✅ CORRECTO
const [dailyStats, booksFinished] = await Promise.all([
  getDailyReadingStats(month, year, userEmail),
  getBooksFinishedInMonth(month, year, userEmail),
]);
```

---

## 3. Bundle Size (CRÍTICOS)

### 3.1 Recharts sin dynamic import

**Archivos afectados**:
- `src/app/(home)/stats/components/daily-activity-chart.tsx`
- `src/app/(home)/stats/components/hourly-activity-chart.tsx`
- `src/app/(home)/stats/components/last-books-graph.tsx`
- `src/app/(home)/stats/components/tags-radar-chart.tsx`

**Regla violada**: `bundle-dynamic-imports`  
**Impacto**: ~150-300KB en bundle inicial

```typescript
// ❌ ACTUAL
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

// ✅ CORRECTO - Lazy load Recharts
import dynamic from 'next/dynamic';

const DailyActivityChart = dynamic(
  () => import('./daily-activity-chart-inner'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[300px]" />
  }
);
```

**Alternativa**: Usar `optimizePackageImports` en `next.config.js`:

```javascript
module.exports = {
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react']
  }
}
```

---

## 4. Server-Side Performance (ALTO)

### 4.1 `force-dynamic` innecesario

**Archivos afectados**:
- `src/app/(home)/page.tsx`
- `src/app/(home)/stats/page.tsx`
- `src/app/(home)/calendar/page.tsx`
- `src/app/(home)/devices/page.tsx`
- `src/app/(home)/highlights/page.tsx`

**Regla violada**: Caching best practices

```typescript
// ❌ ACTUAL
export const dynamic = 'force-dynamic';

// ✅ CORRECTO - Usar revalidación
export const revalidate = 60; // Revalidar cada 60 segundos
// O usar on-demand revalidation con revalidatePath/revalidateTag
```

### 4.2 Página Library como Client Component innecesariamente

**Archivo**: `src/app/(home)/library/page.tsx`  
**Regla violada**: Default to Server Components

```typescript
// ❌ ACTUAL - Client Component con useEffect para fetching
'use client';
function LibraryPage() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    getMyBooks().then(setBooks);
  }, []);
}

// ✅ CORRECTO - Server Component
async function LibraryPage({ searchParams }) {
  const status = searchParams.status || 'all';
  const books = await getMyBooks(status);
  return <LibraryContent books={books} />;
}
```

### 4.3 Sin Suspense boundaries en Stats

**Archivo**: `src/app/(home)/stats/components/stats-wrapper.tsx`  
**Regla violada**: `async-suspense-boundaries`

```tsx
// ❌ ACTUAL - Todo espera a todo
return (
  <div>
    <GeneralStats stats={stats} />
    <DailyActivityChart data={dailyActivity} />
    <HourlyChart data={hourlyActivity} />
    <TagsRadar tags={tags} />
    <LastBooksGraph books={lastBooks} />
  </div>
);

// ✅ CORRECTO - Streaming independiente
return (
  <div>
    <Suspense fallback={<StatsSkeleton />}>
      <GeneralStats />
    </Suspense>
    <Suspense fallback={<ChartSkeleton />}>
      <DailyActivityChart />
    </Suspense>
    <Suspense fallback={<ChartSkeleton />}>
      <HourlyChart />
    </Suspense>
    {/* ... */}
  </div>
);
```

---

## 5. Client-Side Patterns (MEDIO)

### 5.1 useEffect para redirect en sign-in

**Archivo**: `src/app/(no-auth)/sign-in/page.tsx:16-20`  
**Regla violada**: Handle auth in middleware/server

```typescript
// ❌ ACTUAL
'use client';
useEffect(() => {
  if (session) {
    router.push('/');
  }
}, [session]);

// ✅ CORRECTO - Middleware o Server Component
// middleware.ts
export function middleware(request: NextRequest) {
  const session = getSession(request);
  if (session && request.nextUrl.pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### 5.2 Server Actions usadas para reads

**Archivo**: `src/services/BookService.ts:18-29`  
**Regla violada**: Server Actions for mutations only

```typescript
// ❌ ACTUAL - Server Action para leer datos
'use server';
export async function getMyBooks(status: BookStatus) {
  // ...lectura de datos
}

// ✅ CORRECTO - Función normal exportada (no 'use server')
// O usar en Server Component directamente
export async function getMyBooks(status: BookStatus) {
  // Sin 'use server' - es solo una función de lectura
}
```

### 5.3 Sin optimistic updates

**Archivos afectados**:
- `src/app/(no-auth)/book/[slug]/components/library-actions.tsx`
- `src/app/(home)/highlights/components/highlight-card.tsx`

**Regla violada**: Use optimistic updates

```typescript
// ❌ ACTUAL
const handleDelete = async () => {
  await deleteBookHighlight(id);
  toast.success('Deleted');
};

// ✅ CORRECTO - Optimistic update
const handleDelete = async () => {
  // Actualizar UI inmediatamente
  setHighlights(prev => prev.filter(h => h.id !== id));
  
  try {
    await deleteBookHighlight(id);
    toast.success('Deleted');
  } catch {
    // Revertir si falla
    setHighlights(prev => [...prev, highlight]);
    toast.error('Failed to delete');
  }
};
```

### 5.4 Navegación imperativa vs Link

**Archivo**: `src/app/(home)/calendar/components/date-selector/year-month-picker.tsx:92-110`  
**Regla violada**: Use Link for prefetching

```typescript
// ❌ ACTUAL
router.push(`/calendar?month=${month}&year=${year}`);

// ✅ CORRECTO
<Link href={`/calendar?month=${month}&year=${year}`}>
  {monthName}
</Link>
```

---

## 6. Re-render Optimization (MEDIO)

### 6.1 Filtrado en cliente vs servidor

**Archivo**: `src/app/(home)/library/components/library-content.tsx:51-54`  
**Regla violada**: Keep computations on server

El filtrado de libros por status debería hacerse en el servidor, no en el cliente.

### 6.2 Estado derivado en callbacks

**Archivo**: `src/app/(home)/library/components/library-content.tsx:78-83`  
**Regla violada**: `rerender-derived-state-no-effect`

```typescript
// ❌ ACTUAL - Recalcula en handler
const handleChangeStatus = (status: string) => {
  setReadStatus(status);
  const filtered = books.filter(b => b.status === status);
  setFilteredBooks(filtered);
};

// ✅ CORRECTO - Estado derivado durante render
const [readStatus, setReadStatus] = useState('all');
const filteredBooks = useMemo(
  () => books.filter(b => readStatus === 'all' || b.status === readStatus),
  [books, readStatus]
);
```

---

## 7. Aspectos Positivos

1. **Parallel fetching en Home**: `Promise.all` usado correctamente en `page.tsx:21-28`
2. **React.cache() para deduplicación**: Usado en `book/[slug]/page.tsx` para `getBook`
3. **No barrel file imports problemáticos**: Imports directos en general
4. **Estructura de servicios clara**: Repository pattern bien implementado
5. **Loading states**: Archivos `loading.tsx` en cada ruta

---

## Plan de Acción Recomendado

### Fase 1: Seguridad (Urgente)
1. [ ] Agregar validación de `device_code` en `/api/koreader/highlights/route.ts`
2. [ ] Agregar ownership check en `deleteBookHighlight`
3. [ ] Agregar ownership check en `deleteUserDevice`
4. [ ] Agregar auth check en `addBookHighlight`

### Fase 2: Performance Crítica (1-2 días)
1. [ ] Paralelizar fetches en `getMyStats`
2. [ ] Paralelizar fetches en `getCalendarData`
3. [ ] Agregar dynamic imports para Recharts
4. [ ] Convertir Library a Server Component

### Fase 3: Optimizaciones (1 semana)
1. [ ] Reemplazar `force-dynamic` con `revalidate`
2. [ ] Agregar Suspense boundaries en Stats
3. [ ] Mover auth redirect a middleware
4. [ ] Agregar optimistic updates
5. [ ] Convertir navegación imperativa a `<Link>`

### Fase 4: Refinamiento (Ongoing)
1. [ ] Agregar Error Boundaries
2. [ ] Optimizar serialización RSC (pasar menos datos a client)
3. [ ] Considerar SWR para client-side data fetching
4. [ ] Agregar `optimizePackageImports` en next.config.js

---

## Referencias

- [Vercel React Best Practices](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Next.js Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Server Actions Security](https://nextjs.org/docs/app/guides/authentication)
