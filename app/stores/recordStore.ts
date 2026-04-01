import { create } from "zustand";
import { Record } from "../schemas/record.schema";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";

type RecordWithId = Record & { id: string };
interface RecordStore {
  records: RecordWithId[];

  // Actions
  addRecord: (record: Record) => void;
  removeRecord: (id: string) => void;
  updateRecord: (id: string, updated: Partial<Record>) => void;
  getRecord: (id: string) => RecordWithId | undefined;
}
export const useRecordStore = create<RecordStore>()(
  persist(
    devtools((set, get) => ({
      records: [],

      addRecord: (record) =>
        set((state) => ({
          records: [...state.records, { ...record, id: crypto.randomUUID() }],
        })),

      removeRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      updateRecord: (id, updated) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updated } : r,
          ),
        })),

      getRecord: (id) => get().records.find((r) => r.id === id),
    })),
    {
      name: "record-storage",
    },
  ),
);
