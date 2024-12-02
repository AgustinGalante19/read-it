import { parse } from 'date-fns';

export function isAValidDate(value: string) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return regex.test(value);
}

export function formatDate(value: string) {
  const isValid = isAValidDate(value);

  if (!isValid) return value;

  const parsedDate = parse(value, 'yyyy-MM-dd', new Date());

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}
