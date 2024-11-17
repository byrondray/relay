export function formatDate({ date }: { date: Date }) {
  const today = new Date();
  const inputDate = new Date(date);

  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = inputDate.toLocaleString("en-US", { month: "short" });

  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return `Today, ${day} ${month}`;
  }

  return `${day} ${month}`;
}
