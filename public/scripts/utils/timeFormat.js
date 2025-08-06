export function formatRelativeTime(date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "چند ثانیه پیش";
  } else if (minutes < 60) {
    return `${minutes} دقیقه پیش`;
  } else if (hours < 24) {
    return `${hours} ساعت پیش`;
  } else if (days < 7) {
    return `${days} روز پیش`;
  } else if (years < 1) {
    const options = { month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("fa-IR", options);
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("fa-IR", options);
  }
}