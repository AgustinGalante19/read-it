import { Suspense } from 'react';
import LibraryContent from './components/library-content';
import PageFallback from './components/page-fallback';

function LibraryPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LibraryContent />
    </Suspense>
  );
}

export default LibraryPage;
