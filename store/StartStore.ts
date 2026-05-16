import { create } from "zustand";

interface StartStore {
  state: boolean;
  timer: number;
  setState: (state: boolean) => void;
  setTimer: (timer: number) => void;
}

const StartStore = create<StartStore>((set) => ({
  state: false,
  timer: 0,
  setState: (state) => set({ state }),
  setTimer: (timer) => set({ timer }),
}));

export default StartStore;
