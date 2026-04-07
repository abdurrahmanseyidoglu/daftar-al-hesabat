import { create } from "zustand";
import { RecordEntry } from "../schemas/record.schema";

interface ModalStore {
  isModalOpen: boolean;
  modalPredefinedProps: Partial<{ name: string; record: RecordEntry }> | null;
  handleModalState: (modalState: boolean) => void;
  populateModalPredefinedProps: (
    predefinedProps: Partial<{ name: string; record: RecordEntry }>,
  ) => void;
  resetModalPredefinedProps: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  modalPredefinedProps: null,
  handleModalState: (modalState: boolean) => set({ isModalOpen: modalState }),
  populateModalPredefinedProps: (
    predefinedProps: Partial<{ name: string; record: RecordEntry }>,
  ) => set({ modalPredefinedProps: predefinedProps }),
  resetModalPredefinedProps: () => set({ modalPredefinedProps: null }),
}));
