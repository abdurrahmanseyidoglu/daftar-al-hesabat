import { create } from "zustand";

interface AppState {
  initialized: boolean;
  setInitialized: (state: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  initialized: false,
  setInitialized: (state = true) => set({ initialized: state }),
}));
