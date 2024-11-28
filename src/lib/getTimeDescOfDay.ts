export default function getTimeDescOfDay() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 5 && hours < 12) {
    return 'Morning';
  } else if (hours >= 12 && hours < 18) {
    return 'Afternoon';
  } else {
    return 'Evening';
  }
}
