import { create } from "zustand";

interface TextStore {
  text: Record<number, character>;
  setText: (value: string, position: number) => void;
  toggleState: (position: number | null) => void;
  getCharacter: (position: number) => character | undefined;
  getState: (position: number) => boolean | null | undefined;
}

interface character {
  value: string;
  position: number;
  matched?: boolean | null;
}

const textStore = create<TextStore>((set, get) => ({
  text: {},
  setText: (value: string, position: number) =>
    set((state) => ({
      text: { ...state.text, [position]: { value, position } },
    })),
  toggleState: (position: number | null) => {
    if (position === null) return;

    set((state) => ({
      text: {
        ...state.text,
        [position]: {
          ...state.text[position],
          matched: !state.text[position]?.matched,
        },
      },
    }));
  },
  getCharacter: (position: number) => get().text[position],
  getState: (position: number) => {
    const text = get().text;
    return text[position]?.matched ?? null;
  },
}));

export default textStore;
