export const formatDate = (date: Date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(", ", " - ");
};
