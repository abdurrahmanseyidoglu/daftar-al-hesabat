import { create } from "zustand";

interface AppState {
  initialized: boolean;
  setInitialized: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  initialized: false,
  setInitialized: () => set({ initialized: true }),
}));
