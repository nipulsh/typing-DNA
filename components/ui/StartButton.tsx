"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStartStore from "@/store/StartStore";
import typingSessionStore from "@/store/typingSessionStore";
import textTabStore from "@/store/textTabStore";
import textPassageStore from "@/store/textPassageStore";

export function RestartButton() {
  const { state, setState } = useStartStore();
  const activeTab = textTabStore((s) => s.activeTab);

  function handleClick() {
    if (state) {
      typingSessionStore.getState().cancelSession();
    }
    setState(!state);
  }

  function handleRefreshPassage() {
    textPassageStore.getState().refreshPassage();
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent triggering while typing in inputs
      const target = e.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.ctrlKey && e.key === "Enter") {
        if (textTabStore.getState().activeTab === "Zen") return;
        e.preventDefault();
        textPassageStore.getState().refreshPassage();
        return;
      }

      // Alt+S shortcut for start/stop
      if (e.altKey && e.code === "KeyS") {
        e.preventDefault();
        handleClick();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);

  const zen = activeTab === "Zen";

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row select-none">
      <Button
        variant="outline"
        onClick={(e) => {
          e.currentTarget.blur();
          handleClick();
        }}
      >
        {state ? "Stop" : "Start"}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={zen}
        title={zen ? "Switch away from Zen to refresh passage" : "New passage (Ctrl+Enter)"}
        aria-keyshortcuts="Control+Enter"
        onClick={(e) => {
          e.currentTarget.blur();
          handleRefreshPassage();
        }}
      >
        <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
        Refresh
      </Button>
    </div>
  );
}
