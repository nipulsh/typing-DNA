import { create } from "zustand";

interface TextStore {
  text: Record<number, character>;
  setText: (value: string, position: number, matched?: boolean | null) => void;
  toggleState: (position: number | null, matched?: boolean | null) => void;
  getCharacter: (position: number) => character | undefined;
  getState: (position: number) => boolean | null | undefined;
  resetProgress: () => void;
}

interface character {
  value: string;
  position: number;
  matched?: boolean | null;
}

const textStore = create<TextStore>((set, get) => ({
  text: {},
  setText: (value: string, position: number, matched?: boolean | null) =>
    set((state) => ({
      text: { ...state.text, [position]: { value, position, matched } },
    })),
  toggleState: (position: number | null, matched?: boolean | null) => {
    if (position === null) return;

    set((state) => ({
      text: {
        ...state.text,
        [position]: {
          ...state.text[position],
          matched:
            matched !== undefined ? matched : !state.text[position]?.matched,
        },
      },
    }));
  },
  getCharacter: (position: number) => get().text[position],
  getState: (position: number) => {
    const text = get().text;
    return text[position]?.matched ?? null;
  },
  resetProgress: () =>
    set((state) => {
      const next: Record<number, character> = {};
      for (const key of Object.keys(state.text)) {
        const k = Number(key);
        const cell = state.text[k];
        if (cell) next[k] = { ...cell, matched: null };
      }
      return { text: next };
    }),
}));

export default textStore;
