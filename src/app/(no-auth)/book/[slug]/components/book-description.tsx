'use client';

import { useMemo, useState, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(description || '<p>Description not provided</p>', {
        USE_PROFILES: { html: true },
      }),
    [description]
  );

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className='animate-in fade-in-0 slide-in-from-bottom-4 duration-500'
    >
      <div
        className='transition-all duration-500 ease-in-out overflow-hidden relative'
        style={{
          maxHeight: isExpanded ? '1000px' : '120px',
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />

        {!isExpanded && sanitizedContent.length > 300 && (
          <div
            className='absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none'
            style={{ top: '80px' }}
          />
        )}
      </div>

      <div className='flex items-center relative z-20'>
        <Button
          variant='link'
          className='p-0 mt-2 transition-all duration-200 hover:scale-105 hover:translate-y-[-1px] group'
          onClick={handleToggle}
        >
          <span className='flex items-center gap-1'>
            {isExpanded ? (
              <>
                Show less
                <ChevronUp
                  size={16}
                  className='transition-transform duration-200 group-hover:scale-110'
                />
              </>
            ) : (
              <>
                Show more
                <ChevronDown
                  size={16}
                  className='transition-transform duration-200 group-hover:scale-110'
                />
              </>
            )}
          </span>
        </Button>
      </div>
    </section>
  );
};

export default BookDescription;
