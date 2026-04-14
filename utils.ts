import type { Record } from "./app/schemas/record.schema";
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

export const getRecordsFilteredByCurrency = (
  currency: string,
  records: Record[],
): Record[] => {
  return records.map((recordObject) => ({
    name: recordObject.name,
    records: recordObject.records.filter((r) => r.currency === currency),
  }));
};
export const formatMoney = (money: number) => {
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 2 }).format(
    money,
  );
};
