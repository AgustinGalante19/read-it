import { Suspense } from 'react';
import LibraryContent from './components/library-content';
import PageFallback from './components/page-fallback';
import { libraryPageClassName } from './components/library-layout';

function LibraryPage() {
  return (
    <main className={libraryPageClassName}>
      <Suspense fallback={<PageFallback />}>
        <LibraryContent />
      </Suspense>
    </main>
  );
}

export default LibraryPage;
