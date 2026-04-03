import { create } from "zustand";
import { RecordEntry } from "../schemas/record.schema";
interface ModalStore {
  isModalOpen: boolean;
  modalPredefinedProps: ({ name: string } & { record: RecordEntry }) | null;
  handleModalState: (modalState: boolean) => void;
  populateModalPredefinedProps: (
    predefinedProps: { name: string } & { record: RecordEntry },
  ) => void;
  resetModalPredefinedData: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  modalPredefinedProps: null,
  handleModalState: (modalState: boolean) => set({ isModalOpen: modalState }),
  populateModalPredefinedProps: (
    predefinedProps: { name: string } & { record: RecordEntry },
  ) => set({ modalPredefinedProps: predefinedProps }),
  resetModalPredefinedData: () => set({ modalPredefinedProps: null }),
}));
