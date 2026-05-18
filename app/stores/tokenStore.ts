import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TokenStore {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    devtools((set) => ({
      accessToken: "",
      setAccessToken: (token) => set({ accessToken: token }),
    })),
    {
      name: "token-storage",
    },
  ),
);
