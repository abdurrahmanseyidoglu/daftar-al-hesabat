import type { Record } from "./app/schemas/record.schema";
import { json2csv } from "json-2-csv";

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
export const exportToCSV = (data: Record[], filename = "records.csv") => {
  const headers = ["Date", "Name", "Amount", "Currency", "On / To", "Details"];

  const rows: string[] = [];

  data.forEach((person) => {
    person.records.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString(); // e.g. 4/12/2026
      const name = person.name;
      const amount = record.amount;
      const currency = record.currency.toUpperCase(); // "usd" → "USD"
      const direction = record.direction; // "ON" or "TO"
      const details = record.details || "";

      // Wrap in quotes if value contains comma, quote, or newline
      const escape = (val: string) =>
        /[",\n]/.test(String(val))
          ? `"${String(val).replace(/"/g, '""')}"`
          : val;

      rows.push(
        [date, name, String(amount), currency, direction, details]
          .map(escape)
          .join(","),
      );
    });
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); 
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
