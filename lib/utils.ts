import type { Record, RecordEntry } from "../app/schemas/record.schema";
import { MoneyDirection } from "../app/types/enums";

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
export const calculateTotalForPersonRecords = (
  namedRecords: RecordEntry[],
): number => {
  let total = 0;
  namedRecords.forEach((record) => {
    if (record.direction === MoneyDirection.ON) total += record.amount;
    if (record.direction === MoneyDirection.TO) total -= record.amount;
  });
  return total;
};

export const exportAllRecordsToCSV = (
  data: Record[],
  currency: string,
  filename = `records_${currency.toLowerCase()}.csv`,
) => {
  const headers = ["Date", "Name", "Amount", "Currency", "Details"];

  const escape = (val: string | number): string => {
    const str = String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const rows: string[] = [];
  let totalOwed = 0;
  let totalOwing = 0;

  data.forEach((person) => {
    person.records.forEach((record) => {
      const date = new Date(record.date).toLocaleDateString();
      const name = person.name;
      const signedAmount =
        record.direction === "TO" ? -record.amount : record.amount;
      const curr = record.currency.toUpperCase();
      const details = record.details || "";

      if (signedAmount < 0) totalOwed += signedAmount;
      else totalOwing += signedAmount;

      rows.push(
        [date, name, String(signedAmount), curr, details].map(escape).join(","),
      );
    });
  });

  const net = totalOwed + totalOwing;
  const netLabel =
    net < 0
      ? `${Math.abs(net)} ${currency.toUpperCase()} (you owe)`
      : net > 0
        ? `${net} ${currency.toUpperCase()} (owed to you)`
        : `0 ${currency.toUpperCase()}`;

  const totalLines = [
    `You owe:,${Math.abs(totalOwed)} ${currency.toUpperCase()}`,
    `Owed to you:,${totalOwing} ${currency.toUpperCase()}`,
    `Net balance:,${netLabel}`,
  ];

  const csv = [headers.join(","), ...rows, "", ...totalLines].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportSinglePersonToCSV = (
  name: string,
  records: RecordEntry[],
  currency: string,
) => {
  const headers = ["Date", "Amount", "Currency", "Details"];

  const escape = (val: string | number): string => {
    const str = String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const rows: string[] = [];
  let totalOwed = 0;
  let totalOwing = 0;

  rows.push(`Name:,${escape(name)}`);
  rows.push("");
  rows.push(headers.join(","));

  records.forEach((record) => {
    const date = new Date(record.date).toLocaleDateString();
    const signedAmount =
      record.direction === "TO" ? -record.amount : record.amount;
    const curr = record.currency.toUpperCase();
    const details = record.details || "";

    if (signedAmount < 0) totalOwed += signedAmount;
    else totalOwing += signedAmount;

    rows.push(
      [date, String(signedAmount), curr, details].map(escape).join(","),
    );
  });

  const net = totalOwed + totalOwing;
  const netLabel =
    net < 0
      ? `${Math.abs(net)} ${currency.toUpperCase()} (you owe ${name})`
      : net > 0
        ? `${net} ${currency.toUpperCase()} (${name} owes you)`
        : `0 ${currency.toUpperCase()}`;

  const totalLines = [
    `You owe ${name}:,${Math.abs(totalOwed)} ${currency.toUpperCase()}`,
    `${name} owes you:,${totalOwing} ${currency.toUpperCase()}`,
    `Net balance:,${netLabel}`,
  ];

  rows.push("", ...totalLines);

  const csv = rows.join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const safeName = name.trim().toLowerCase().replace(/\s+/g, "_");
  const filename = `${safeName}_${currency.toLowerCase()}.csv`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
