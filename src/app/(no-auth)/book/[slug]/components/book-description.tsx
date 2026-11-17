'use client';

import { useMemo, useState, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BookDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(description || '<p>Description not provided</p>', {
        USE_PROFILES: { html: true },
      }),
    [description],
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
      className='animate-in fade-in-0 slide-in-from-bottom-4 duration-500 lg:max-w-[68ch] lg:animate-none lg:text-muted-foreground'
    >
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-500 ease-in-out lg:max-h-none lg:overflow-visible lg:transition-none',
          isExpanded ? 'max-h-[1000px]' : 'max-h-[120px]',
        )}
      >
        <div
          className='lg:text-base/7 lg:wrap-anywhere lg:[&_a]:text-primary lg:[&_a]:underline lg:[&_ol]:list-decimal lg:[&_p+p]:mt-4 lg:[&_ul]:list-disc lg:[&_ol]:ps-5 lg:[&_ul]:ps-5'
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />

        {!isExpanded && sanitizedContent.length > 300 && (
          <div
            className='pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/90 to-transparent lg:hidden'
            style={{ top: '80px' }}
          />
        )}
      </div>

      <div className='relative z-20 flex items-center lg:hidden'>
        <Button
          variant='link'
          className='p-0 mt-2 transition-all duration-200 hover:scale-105 hover:-translate-y-px group'
          onClick={handleToggle}
          endIcon={
            isExpanded ? (
              <ChevronUp
                size={16}
                className='transition-transform duration-200 group-hover:scale-110'
              />
            ) : (
              <ChevronDown
                size={16}
                className='transition-transform duration-200 group-hover:scale-110'
              />
            )
          }
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </section>
  );
};

export default BookDescription;
