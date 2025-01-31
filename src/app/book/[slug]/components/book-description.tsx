'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import DOMPurify from 'isomorphic-dompurify';

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
      <div className='flex items-center justify-end'>
        {!isExpanded && sanitizedContent.length > 300 && (
          <Button
            variant='link'
            className='mt-2'
            onClick={() => setIsExpanded(true)}
          >
            Show more
          </Button>
        )}
        {isExpanded && (
          <Button
            variant='link'
            className='mt-2'
            onClick={() => setIsExpanded(false)}
          >
            Show less
          </Button>
        )}
      </div>
    </section>
  );
};

export default BookDescription;
