import { BookStatus } from '@/types/Book';
import datesHelper from './DatesHelper';

export default function ReadDatesHelper(
  newStatus: number,
  existingBook: { start_date?: string | null } | null
): { startDate?: string; finishDate?: string } {
  const currentDate = datesHelper.getCurrentDateDefault();
  const dates: { startDate?: string; finishDate?: string } = {};

  switch (newStatus) {
    case BookStatus.READING:
      dates.startDate = currentDate;
      break;
    case BookStatus.READ:
      if (!existingBook?.start_date) {
        dates.startDate = currentDate;
      }
      dates.finishDate = currentDate;
      break;
  }

  return dates;
}
