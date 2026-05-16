import { create } from "zustand";

interface KeystrokeStore {
  value: string;
  setValue: (value: string) => void;
  position: number;
  setPosition: (position: number) => void;
}

const keystrokeStore = create<KeystrokeStore>((set) => ({
  value: "",
  setValue: (value: string) => set({ value }),
  position: 0,
  setPosition: (position: number) => set({ position }),
}));

export default keystrokeStore;
