import { create } from "zustand";
import textTabStore from "@/store/textTabStore";
import keystrokeStore from "@/store/keystrokeStore";
import textStore from "@/store/TextStore";
import typingSessionStore from "@/store/typingSessionStore";
import useStartStore from "@/store/StartStore";

type TextPassageState = {
  refreshNonce: number;
  refreshPassage: () => void;
};

function resetTypingForNewPassage() {
  keystrokeStore.setState({ position: 0, value: "" });
  const started = useStartStore.getState().state;
  if (started) {
    typingSessionStore.getState().cancelSession();
    typingSessionStore.getState().beginSession();
  } else {
    typingSessionStore.getState().cancelSession();
  }
}

const textPassageStore = create<TextPassageState>((set) => ({
  refreshNonce: 0,
  refreshPassage: () => {
    if (textTabStore.getState().activeTab === "Zen") return;
    resetTypingForNewPassage();
    set((s) => ({ refreshNonce: s.refreshNonce + 1 }));
  },
}));

export default textPassageStore;
