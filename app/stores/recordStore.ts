import { create } from "zustand";
import { Record, RecordEntry } from "../schemas/record.schema";
import { persist, devtools } from "zustand/middleware";

type RecordWithId = Record;
interface RecordStore {
  records: RecordWithId[];
  doesNameExistInRecords: (name: string) => boolean;
  addRecordToExistingName: (name: string, record: RecordEntry) => void;
  addRecordToNewName: (name: string, record: RecordEntry) => void;
  removeRecord: (name: string, id: string) => void;
  updateRecord: (name: string, id: string, updatedRecord: RecordEntry) => void;
  getRecordById: (name: string, id: string) => RecordWithId | undefined;
  getRecordsArrayByName: (name: string) => RecordWithId | undefined;
  removeUsersByIndexes: (indexes: number[]) => void;
}
export const useRecordStore = create<RecordStore>()(
  persist(
    devtools((set, get) => ({
      records: [],
      doesNameExistInRecords: (name: string) => {
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
        if (!get().doesNameExistInRecords(name)) return;
        else {
          // loop through the records using the map
          // find the record by name and then make a new array that has all its original elements except the record with the passed id.
          set((state) => ({
            records: state.records.map((r) => {
              if (r.name !== name) {
                return r;
              } else {
                return {
                  name: r.name,
                  records: r.records.filter((record) => record.id !== id),
                };
              }
            }),
          }));
        }
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
        return recordsByName[0];
      },
      removeUsersByIndexes: (indexes: number[]) =>
        set((state) => ({
          records: state.records.filter(
            (record, index) => !indexes.includes(index),
          ),
        })),
    })),
    {
      name: "record-storage",
    },
  ),
);
