import { create } from "zustand";
import { Record, RecordEntry } from "../schemas/record.schema";
import { persist, devtools } from "zustand/middleware";
import { MoneyDirection } from "../types/enums";
interface PersonTotal {
  totalOnHim: number;
  totalToHim: number;
  total: number;
  direction: MoneyDirection | 0;
}
interface GlobalTotal {
  totalOnThem: number;
  totalToThem: number;
  total: number;
  direction: MoneyDirection | 0;
}
interface RecordStore {
  records: Record[];
  doesNameExistInRecords: (name: string | null) => boolean;
  addRecordToExistingName: (name: string, record: RecordEntry) => void;
  addRecordToNewName: (name: string, record: RecordEntry) => void;
  removeRecord: (name: string | null, id: string | null) => boolean;
  updateRecord: (name: string, id: string, updatedRecord: RecordEntry) => void;
  getRecordById: (name: string, id: string) => Record | undefined;
  getRecordsArrayByName: (name: string) => RecordEntry[] | undefined;
  removeNameWithHisRecords: (name: string | null) => boolean; // true -> Deleted / false -> Not Deleted
  calculateTotalPerPerson: (
    name: string,
    currency: string,
  ) => PersonTotal | undefined;
  calculateTotalGlobally: (currency: string) => GlobalTotal | undefined;
}
export const useRecordStore = create<RecordStore>()(
  persist(
    devtools((set, get) => ({
      records: [],
      doesNameExistInRecords: (name: string | null) => {
        const records = get().records;
        return records.some((r) => r.name === name);
      },
      addRecordToExistingName: (name, record) => {
        if (!get().doesNameExistInRecords(name)) return;
        else {
          set((state) => ({
            records: state.records.map((r) => {
              if (r.name !== name) return r;

              return {
                name: r.name,
                records: [
                  ...r.records,
                  {
                    id: crypto.randomUUID(),
                    ...record,
                  },
                ],
              };
            }),
          }));
        }
      },
      addRecordToNewName: (name, record) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              name: name,
              records: [
                {
                  id: crypto.randomUUID(),
                  ...record,
                },
              ],
            },
          ],
        })),

      removeRecord: (name, id) => {
        if (!name && !get().doesNameExistInRecords(name)) return false;
        let removed = false;

        // loop through the records using the map
        // find the record by name and then make a new array that has all its original elements except the record with the passed id.
        set((state) => ({
          records: state.records.map((r) => {
            if (r.name !== name) return r;
            const filtered = r.records.filter((record) => record.id !== id);
            if (filtered.length < r.records.length) removed = true;
            return { name: r.name, records: filtered };
          }),
        }));
        return removed;
      },
      updateRecord: (name, id, updatedRecord) => {
        if (!get().doesNameExistInRecords(name)) return;

        set((state) => ({
          records: state.records.map((r) => {
            if (r.name !== name) return r;

            return {
              ...r,
              records: r.records.map((record) => {
                if (record.id !== id) return record;
                const result = { ...updatedRecord };
                result.id = record?.id; // preserve original record id incase the updatedRecord has a different id.
                return result;
              }),
            };
          }),
        }));
      },

      getRecordById: (name, id) => {
        const recordsByName = get().records.filter((rs) => rs.name === name);
        if (recordsByName.length === 0) {
          return;
        }
        return recordsByName[0].records.filter((r) => r.id === id);
      },
      getRecordsArrayByName: (name) => {
        const recordsByName = get().records.filter((rs) => rs.name === name);

        if (recordsByName.length === 0) {
          return;
        }
        return recordsByName[0].records;
      },
      removeNameWithHisRecords: (name) => {
        if (!name || !get().doesNameExistInRecords(name)) return false;
        set((state) => ({
          records: state.records.filter((r) => r.name !== name),
        }));
        return true;
      },
      calculateTotalPerPerson: (name, currency) => {
        if (!name || !get().doesNameExistInRecords(name)) {
          console.log("there is no such name " + name);
        }
        const records = get().getRecordsArrayByName(name);
        const filteredRecords = records?.filter(
          (record) => record.currency === currency,
        );
        if (filteredRecords?.length === 0) {
          return;
        }

        let total = 0;
        let totalOnHim = 0;
        let totalToHim = 0;
        filteredRecords?.forEach((record) => {
          if (record.direction === MoneyDirection.ON) {
            totalOnHim += record.amount;
          }
          if (record.direction === MoneyDirection.TO) {
            totalToHim += record.amount;
          }
        });
        total = totalOnHim - totalToHim;

        return {
          totalOnHim,
          totalToHim,
          total,
          direction:
            total < 0 ? MoneyDirection.TO : total > 0 ? MoneyDirection.ON : 0,
        };
      },
    })),
    {
      name: "record-storage",
    },
  ),
);
