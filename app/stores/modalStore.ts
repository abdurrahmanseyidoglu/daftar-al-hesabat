import { create } from "zustand";
import { devtools } from "zustand/middleware";
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

export const useModalStore = create<ModalStore>()(
  devtools((set) => ({
    isModalOpen: false,
    modalPredefinedProps: null,
    handleModalState: (modalState: boolean) =>
      set({ isModalOpen: modalState }, false, "handleModalState"),
    populateModalPredefinedProps: (
      predefinedProps: Partial<{ name: string; record: RecordEntry }>,
    ) =>
      set(
        { modalPredefinedProps: predefinedProps },
        false,
        "populateModalPredefinedProps",
      ),
    resetModalPredefinedProps: () =>
      set({ modalPredefinedProps: null }, false, "resetModalPredefinedProps"),
  })),
);
