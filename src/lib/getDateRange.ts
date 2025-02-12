export default function getDateRange(untilAgo: number) {
  const currentDate = new Date();
  const untilAgoDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - untilAgo,
    1
  );

  return { currentDate, result: untilAgoDate };
}
