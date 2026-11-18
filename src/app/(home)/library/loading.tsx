import PageFallback from './components/page-fallback';
import { libraryPageClassName } from './components/library-layout';

export default function Loading() {
  return (
    <main className={libraryPageClassName} aria-busy='true'>
      <PageFallback />
    </main>
  );
}
