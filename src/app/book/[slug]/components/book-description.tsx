'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';

const BookDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(description || '<p>Description not provided</p>', {
        USE_PROFILES: { html: true },
      }),
    [description]
  );
  const truncatedContent = useMemo(
    () => sanitizedContent.slice(0, 300) + '...',
    [sanitizedContent]
  );

  return (
    <section>
      <div
        dangerouslySetInnerHTML={{
          __html: isExpanded ? sanitizedContent : truncatedContent,
        }}
      />
      {!isExpanded && sanitizedContent.length > 300 && (
        <Button
          variant='outline'
          className='mt-2'
          onClick={() => setIsExpanded(true)}
        >
          Mostrar más
        </Button>
      )}
      {isExpanded && (
        <Button
          variant='outline'
          className='mt-2'
          onClick={() => setIsExpanded(false)}
        >
          Mostrar menos
        </Button>
      )}
    </section>
  );
};

export default BookDescription;
