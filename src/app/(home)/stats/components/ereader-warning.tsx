'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleAlert } from 'lucide-react';

export function EreaderWarning() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type='button' aria-label='About e-reader activity' className='flex size-6 items-center justify-center rounded-full'>
            <CircleAlert aria-hidden='true' className='size-4' />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='max-w-60'>
            Activity is recorded by an e-reader with the Read It plugin for KOReader.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
