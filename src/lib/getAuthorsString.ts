export default function getAuthorsString(
  authors: string[] | string | undefined
) {
  if (!authors) return 'Not Provided';

  if (typeof authors !== 'string') return authors?.join(' ');

  return authors;
}
