export default function getMostFrequentTag(tags: string) {
  const splittedTags: string[] = tags.split('/').map((tag) => tag.trim());

  const tagCount: Record<string, number> = splittedTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentTag = Object.keys(tagCount).reduce((maxTag, currentTag) =>
    tagCount[currentTag] > tagCount[maxTag] ? currentTag : maxTag
  );

  return mostFrequentTag;
}
