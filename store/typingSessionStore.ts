import { create } from "zustand";

export type TypingKeystrokeEvent = {
  at: number;
  key: string;
  expectedChar: string | null;
  matched: boolean | null;
  position: number;
};

type TypingSessionState = {
  sessionId: string | null;
  events: TypingKeystrokeEvent[];
  beginSession: () => void;
  appendEvent: (e: TypingKeystrokeEvent) => void;
  cancelSession: () => void;
  getSessionForPersist: () => {
    sessionId: string;
    events: TypingKeystrokeEvent[];
  } | null;
  clearAfterPersist: () => void;
};

const typingSessionStore = create<TypingSessionState>((set, get) => ({
  sessionId: null,
  events: [],
  beginSession: () =>
    set({ sessionId: crypto.randomUUID(), events: [] }),
  appendEvent: (e) =>
    set((s) => {
      if (!s.sessionId) return s;
      return { events: [...s.events, e] };
    }),
  cancelSession: () => set({ sessionId: null, events: [] }),
  getSessionForPersist: () => {
    const { sessionId, events } = get();
    if (!sessionId) return null;
    return { sessionId, events };
  },
  clearAfterPersist: () => set({ sessionId: null, events: [] }),
}));

export default typingSessionStore;
