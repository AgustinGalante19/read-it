import { parse, isValid } from 'date-fns';

const dateFormats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy'];

export function formatDate(value: string) {
  let parsedDate;

  for (const format of dateFormats) {
    parsedDate = parse(value, format, new Date());
    if (isValid(parsedDate)) break;
  }

  if (!isValid(parsedDate)) return value;

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}
export function getDateString(date: string | undefined) {
  if (!date) return 'Not Provided';

  return formatDate(date);
}

// Función para convertir string yyyy-mm-dd a Date local
export function parseLocalDate(dateString: string): Date | undefined {
  if (!dateString || dateString === 'null') return undefined;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}
