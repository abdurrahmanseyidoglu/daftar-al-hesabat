import type { Record } from "./app/schemas/record.schema";
import { useRecordStore } from "./app/stores/recordStore";
const records = useRecordStore.getState().records;
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

export const getRecordsFilteredByCurrency = (currency: string): Record[] => {
  return records.map((recordObject) => {
    return {
      name: recordObject.name,
      records: recordObject.records.filter((r) => r.currency === currency),
    };
  });
};
