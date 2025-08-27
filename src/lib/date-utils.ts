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

// Función para obtener la fecha actual con hora establecida en 12:00:00 como string
export function getCurrentDateDefault(): string {
  const now = new Date();
  now.setHours(12, 0, 0, 0); // Establece hora:minutos:segundos:milisegundos a 12:00:00.000

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Función para obtener una fecha específica con hora establecida en 12:00:00 como string
export function getDateNormalized(date: Date): string {
  const targetDate = new Date(date);
  targetDate.setHours(12, 0, 0, 0); // Establece hora:minutos:segundos:milisegundos a 12:00:00.000

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const seconds = String(targetDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
