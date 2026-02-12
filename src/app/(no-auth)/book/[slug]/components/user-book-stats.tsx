'use client';

import { Calendar1, ChartBar, Clock, EqualApproximately } from 'lucide-react';
import { Book } from '@/types/Book';
import { ResultWithMetadata } from '@/types/Result';
import datesHelper from '@/services/helpers/DatesHelper';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

function UserBookStats({
  userBookData,
}: {
  userBookData: ResultWithMetadata<
    Book | null,
    { lastSyncDate: string | null }
  >;
}) {
  const lastSyncDate = useMemo(() => {
    if (!userBookData.metadata?.lastSyncDate) return '';

    const date = parseISO(userBookData.metadata?.lastSyncDate);
    return format(date, 'dd/MM/yyyy HH:mm');
  }, [userBookData.metadata?.lastSyncDate]);
  return (
    <div className='flex justify-between'>
      <div>
        {userBookData.data && (
          <div>
            {userBookData.data.finish_date && (
              <span className='text-xs text-surface-foreground flex items-center gap-1'>
                <Calendar1 size={14} />
                Finished at:{' '}
                {format(userBookData.data.finish_date, 'dd/MM/yyyy')}
              </span>
            )}
            {userBookData.data.book_total_read_time &&
            userBookData.data.book_total_read_time > 0 ? (
              <span className='text-xs text-surface-foreground flex items-center gap-1'>
                <Clock size={14} />
                Reading time:{' '}
                {datesHelper.formatSecondsToDuration(
                  userBookData.data.book_total_read_time,
                )}
              </span>
            ) : null}
            {userBookData.data.id_book_status === 2 &&
              userBookData.data.book_total_read_pages && (
                <span className='text-xs text-surface-foreground flex items-center gap-1'>
                  <EqualApproximately size={14} />
                  Progress:{' '}
                  {Math.round(
                    (userBookData.data.book_total_read_pages /
                      userBookData.data.page_count) *
                      100,
                  )}
                </span>
              )}
          </div>
        )}
      </div>
      {userBookData.metadata?.lastSyncDate && (
        <div>
          <span className='text-xs text-surface-foreground flex items-center gap-1'>
            <ChartBar size={14} /> Last Sync: {lastSyncDate}
          </span>
        </div>
      )}
    </div>
  );
}

export default UserBookStats;
