import { create } from "zustand";

interface StartStore {
  start: boolean;
  time: number;
  setStart: (start: boolean) => void;
  setTime: (time: number) => void;
  reset: () => void;
}

const useStartStore = create<StartStore>((set) => ({
  start: false,
  time: 0,
  setStart: (start) => set({ start }),
  setTime: (time) => set({ time }),
  reset: () => set({ start: false, time: 0 }),
}));

export default useStartStore;