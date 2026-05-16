import { create } from "zustand";

export type TextTab = "Normal" | "Coding" | "Symbols" | "Adaptive" | "Zen";

interface TextTabStore {
  activeTab: TextTab;
  setActiveTab: (tab: TextTab) => void;
}

const textTabStore = create<TextTabStore>((set) => ({
  activeTab: "Normal",
  setActiveTab: (activeTab) => set({ activeTab }),
}));

export default textTabStore;
