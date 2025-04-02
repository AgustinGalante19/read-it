export default function normalizeBookTags(bookTags: { tags: string }[]) {
  const unrepeatedTags = new Set(
    bookTags.flatMap(({ tags }) => {
      if (!tags) {
        return '';
      } else {
        return tags.split('/').map((subTag: string) => subTag.trim());
      }
    })
  );
  return unrepeatedTags;
}
